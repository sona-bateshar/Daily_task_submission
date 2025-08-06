from django.urls import path
from .views import (
    HybridLoginView, 
    HybridLogoutView, 
    HybridTokenRefreshView,
    UserProfileView,
    PasswordChangeView
)

urlpatterns = [
    # Hybrid authentication endpoints
    path('auth/login/', HybridLoginView.as_view(), name='hybrid_login'),
    path('auth/logout/', HybridLogoutView.as_view(), name='hybrid_logout'),
    path('auth/refresh/', HybridTokenRefreshView.as_view(), name='hybrid_refresh'),
    path('auth/user/', UserProfileView.as_view(), name='user_profile'),
    path('auth/password-change/', PasswordChangeView.as_view(), name='user_password_change' )
]