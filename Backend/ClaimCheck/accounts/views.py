from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, TokenBackendError
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import UserSerializer

User = get_user_model()

from rest_framework.exceptions import ValidationError

class UserView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

       
        
class HybridLoginView(APIView):
    """
    Hybrid login view that handles both web and mobile clients
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        # email = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user
        user = authenticate(username=username, password=password)
        if not user:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'error': 'Account is disabled'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Update last login
        if settings.SIMPLE_JWT.get('UPDATE_LAST_LOGIN'):
            update_last_login(None, user)
        
        
        if request.client_type == 'mobile':
            # Mobile client - return JSON tokens
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'first_name': getattr(user, 'first_name', ''),
                    'last_name': getattr(user, 'last_name', ''),
                },
                'client_type': 'mobile'
            }, status=status.HTTP_200_OK)
        
        elif request.client_type == 'web':
            # Web client - set cookies and return user info
            response = Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'first_name': getattr(user, 'first_name', ''),
                    'last_name': getattr(user, 'last_name', ''),
                },
                'client_type': 'web'
            }, status=status.HTTP_200_OK)
            
            # Set access token cookie
            response.set_cookie(
                settings.JWT_COOKIE_NAME,
                str(access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.JWT_COOKIE_HTTP_ONLY,
                secure=settings.JWT_COOKIE_SECURE,
                samesite=settings.JWT_COOKIE_SAMESITE,
                path=settings.JWT_COOKIE_PATH,
            )
            
            # Set refresh token cookie
            response.set_cookie(
                settings.JWT_REFRESH_COOKIE_NAME,
                str(refresh),
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.JWT_COOKIE_HTTP_ONLY,
                secure=settings.JWT_COOKIE_SECURE,
                samesite=settings.JWT_COOKIE_SAMESITE,
                path=settings.JWT_COOKIE_PATH,
            )
            
            print(response)
            return response
        # Raise detailed error for missing or invalid header
        else:
            raise ValidationError({
                "error": "Invalid or missing header value",
                "message": f"Invalid 'X-Client-Type' header value: '{request.client_type}'",
                "received_value": request.client_type,
                "allowed_values": ["mobile", "web"],
                "examples": {
                    "correct_mobile": "X-Client-Type: mobile",
                    "correct_web": "X-Client-Type: web"
                }
            })
        


class HybridLogoutView(APIView):
    """
    Hybrid logout view that handles both web and mobile clients
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        cookie_token = self.get_token_from_cookie(request)
        jon_token = self.request.data.get('refresh')
        refresh_token = cookie_token if cookie_token else jon_token

        if refresh_token:
            try:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()

                response = Response({ 'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
                response.delete_cookie(settings.JWT_COOKIE_NAME)
                response.delete_cookie(settings.JWT_REFRESH_COOKIE_NAME)
                
                return response
            except InvalidToken as e:
                return Response({'error': str(e)}, status=401)
            except TokenBackendError as e:
                return Response({'error': str(e)}, status=500)
            except TokenError as e:
                return Response({'error': str(e)}, status=400)
            except Exception as e:
                return Response({'error': 'Unexpected error'}, status=500)
        else:
            return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        

    def get_token_from_cookie(self, request):
        """Extract JWT token from cookie"""
        return request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
    
    def get_token_from_header(self, request):
        """Extract JWT token from Authorization header"""
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1]
        return None
    


class HybridTokenRefreshView(APIView):
    """
    Hybrid token refresh view that handles both web and mobile clients
    """
    permission_classes = [AllowAny]
    
    
    def post(self, request):
        client_type = request.client_type
        
        if client_type == 'mobile':
            # Mobile client - get refresh token from JSON body
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Web client - get refresh token from cookie
            refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
            if not refresh_token:
                return Response({
                    'error': 'Refresh token not found'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Validate and refresh the token
            refresh = RefreshToken(refresh_token)
            new_access_token = refresh.access_token
            
            # If rotating refresh tokens, generate new refresh token
            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS'):
                refresh.blacklist()  # Blacklist old refresh token
                user = self.get_user(refresh)
                new_refresh_token = RefreshToken.for_user(user)
            else:
                new_refresh_token = refresh
            
        except TokenError as e:
            return Response({
                'error': 'Invalid or expired refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if client_type == 'mobile':
            # Mobile client - return JSON tokens
            response_data = {
                'access': str(new_access_token),
                'client_type': 'mobile'
            }
            
            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS'):
                response_data['refresh'] = str(new_refresh_token)
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        elif client_type == 'web':
            # Web client - set new cookies
            response = Response({
                'message': 'Token refreshed successfully',
                'client_type': 'web'
            }, status=status.HTTP_200_OK)
            
            # Set new access token cookie
            response.set_cookie(
                settings.JWT_COOKIE_NAME,
                str(new_access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.JWT_COOKIE_HTTP_ONLY,
                secure=settings.JWT_COOKIE_SECURE,
                samesite=settings.JWT_COOKIE_SAMESITE,
                path=settings.JWT_COOKIE_PATH,
            )
            
            # Set new refresh token cookie if rotating
            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS'):
                response.set_cookie(
                    settings.JWT_REFRESH_COOKIE_NAME,
                    str(new_refresh_token),
                    max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                    httponly=settings.JWT_COOKIE_HTTP_ONLY,
                    secure=settings.JWT_COOKIE_SECURE,
                    samesite=settings.JWT_COOKIE_SAMESITE,
                    path=settings.JWT_COOKIE_PATH,
                )
            
            return response
        else:
            raise ValidationError({
                "error": "Invalid or missing header value",
                "message": f"Invalid 'X-Client-Type' header value: '{request.client_type}'",
                "received_value": request.client_type,
                "allowed_values": ["mobile", "web"],
                "examples": {
                    "correct_mobile": "X-Client-Type: mobile",
                    "correct_web": "X-Client-Type: web"
                }
            })
        
    def get_user(self, validated_token):
        """Get user from validated token"""
        try:
            user_id = validated_token[settings.SIMPLE_JWT['USER_ID_CLAIM']]
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            raise InvalidToken('User not found') 
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
                    'id': user.id,
                    'username': user.username,
                    'first_name': getattr(user, 'first_name', ''),
                    'last_name': getattr(user, 'last_name', ''),
                },
                status=status.HTTP_200_OK)


from .serializers import PasswordChangeSerializer
class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        print(request.data)
        serializer = PasswordChangeSerializer(instance =  self.request.user, data = self.request.data)
        
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        user = serializer.instance
        return Response({
                    'id': user.id,
                    'username': user.username,
                    'first_name': getattr(user, 'first_name', ''),
                    'last_name': getattr(user, 'last_name', ''),
                },
                status=status.HTTP_200_OK)
   