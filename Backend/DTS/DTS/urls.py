"""
URL configuration for DTS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.contrib import admin
from django.urls import path, include

from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    # TokenVerifyView, 
    LogoutView,
)



# your_project/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView
)

urlpatterns = [
    # ... your other urls
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # Optional: For user logout/token blacklisting
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
]

# urlpatterns = [
#     path('admin/', admin.site.urls),

#     # simple jwt auth views
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'), 

#     # path('api/logout/', LogoutView.as_view(), name='token_logout'),

#     path('api/token_custom_class/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair_custom'),
#     path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
#     path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'), 

#     path('api/logout/', LogoutView.as_view(), name='token_logout'),

#     # custom apps
#     path('api/accounts/', include('accounts.urls')),
#     # path('api/companies/', include('companies.urls')),
#     path('api/hr/', include('hr.urls')),
#     path('api/tasks/', include('tasks.urls')),
# ]




# # accounts/urls.py
# from django.urls import path, include
# from .views import HybridLoginView, HybridLogoutView, HybridTokenRefreshView



# urlpatterns = [
#     # Hybrid authentication endpoints
#     path('auth/login/', HybridLoginView.as_view(), name='hybrid_login'),
#     path('auth/logout/', HybridLogoutView.as_view(), name='hybrid_logout'),
#     path('auth/token/refresh/', HybridTokenRefreshView.as_view(), name='hybrid_refresh'),
    
#     # Other dj-rest-auth endpoints (registration, password reset, etc.)
#     path('auth/', include('dj_rest_auth.urls')),
#     path('auth/registration/', include('dj_rest_auth.registration.urls')),
# ]

