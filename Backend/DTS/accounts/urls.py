from rest_framework.routers import DefaultRouter
from django.urls import path, include # Make sure path is imported

from .views import (
     UserProfileView
    # ... (other ViewSets like CompanyViewSet, BranchViewSet, etc.) ...
)

# If you're using a router for other viewsets, include it first
router = DefaultRouter()
# router.register(r'companies', CompanyViewSet)
# ... etc.



urlpatterns = router.urls # This line should be first if you're using a router

# --- Add your User Registration API URL ---
urlpatterns += [
    # path('register/', UserRegisterView.as_view(), name='user_register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    # path('', include(router.urls)),
    # ... (other direct API paths like user_profile, my-companies-list) ...
]
