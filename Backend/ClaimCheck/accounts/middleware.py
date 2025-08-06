# middleware.py
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from functools import wraps


class ClientTypeMiddleware(MiddlewareMixin):
    """
    Simple middleware to attach client_type to each request
    """
    
    def process_request(self, request):
        """
        Read X-Client-Type header and attach to request
        """
        client_type_header = request.META.get('HTTP_X_CLIENT_TYPE', '').lower().strip()
        
        if client_type_header == 'mobile':
            request.client_type = 'mobile'
        elif client_type_header == 'web':
            request.client_type = 'web'
        else:
            request.client_type = None
        
        return None


class ClientTypeHeaderError(Exception):
    """Custom exception for client type header errors"""
    def __init__(self, message, required_types):
        self.message = message
        self.required_types = required_types
        super().__init__(self.message)