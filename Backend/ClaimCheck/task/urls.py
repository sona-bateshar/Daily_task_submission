from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TaskViewSet, CommentViewSet

router = DefaultRouter()

router.register('task', TaskViewSet, basename='tasks')
router.register('comment', CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(router.urls)),

]