from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .dynamic_views import generate_hr_viewsets
from .views import AdminPasswordResetView

router = DefaultRouter()
dynamic_viewsets = generate_hr_viewsets()

for route_name, viewset in dynamic_viewsets.items():
    router.register(f'{route_name}', viewset, basename=f'{route_name}')

urlpatterns = [
    path('', include(router.urls)),
    path('users/<int:pk>/password_reset/', AdminPasswordResetView.as_view(), name='admin-password-reset'),

]
