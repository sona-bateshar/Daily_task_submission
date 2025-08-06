
# accounts/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.authentication import BaseAuthentication
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt

User = get_user_model()

class HybridJWTAuthentication(BaseAuthentication):
    """
    Hybrid JWT authentication that supports both:
    1. Cookies (for web browsers)
    2. Authorization headers (for mobile/desktop apps)
    """
    
    def authenticate(self, request):
        # Try cookie authentication first (web clients)
        cookie_token = self.get_token_from_cookie(request, settings.JWT_COOKIE_NAME)
        if cookie_token:
            try:
                validated_token = UntypedToken(cookie_token)
                user = self.get_user(validated_token)
                return (user, validated_token)
            except (InvalidToken, TokenError):
                pass
        
        # Try header authentication (mobile clients)
        header_token = self.get_token_from_header(request)
        if header_token:
            try:
                validated_token = UntypedToken(header_token)
                user = self.get_user(validated_token)
                return (user, validated_token)
            except (InvalidToken, TokenError):
                pass
        
        return None
    
    def get_token_from_cookie(self, request, cookie_name):
        """Extract JWT token from cookie"""
        return request.COOKIES.get(cookie_name)
    
    def get_token_from_header(self, request):
        """Extract JWT token from Authorization header"""
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1]
        return None
    
    def get_user(self, validated_token):
        """Get user from validated token"""
        try:
            user_id = validated_token[settings.SIMPLE_JWT['USER_ID_CLAIM']]
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            raise InvalidToken('User not found')
    
    def authenticate_header(self, request):
        return 'Bearer'
    
