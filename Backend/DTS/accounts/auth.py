from rest_framework_simplejwt.authentication import JWTAuthentication
from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from rest_framework.authentication import BaseAuthentication

class HybridJWTAuthentication(BaseAuthentication):
    """
    Custom authentication class that handles both cookie and header-based JWT auth
    """
    
    def authenticate(self, request):
        # Try cookie authentication first (for web clients)
        cookie_auth = JWTCookieAuthentication()
        try:
            cookie_result = cookie_auth.authenticate(request)
            if cookie_result:
                return cookie_result
        except:
            pass
        
        # Try header authentication (for mobile clients)
        header_auth = JWTAuthentication()
        try:
            header_result = header_auth.authenticate(request)
            if header_result:
                return header_result
        except:
            pass
        
        return None
