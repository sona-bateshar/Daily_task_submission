from gc import get_objects
from django.shortcuts import render
from django.core.exceptions import ValidationError
 

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, generics, permissions, status

from .serializers import  UserProfileSerializer, PasswordChangeSerializer
from .permissions import  UserModelPermission
from .models import customUser




class UserProfileView(APIView):
    permission_classes = [IsAuthenticated, UserModelPermission]
    
    def get(self, request):
        serializer  = UserProfileSerializer(self.request.user)
        return Response(serializer.data)
    def put(self, request):
        serializer = UserProfileSerializer(instance = self.request.user, data = self.request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response(serializer.data)
    def patch(self, request):
        serializer = UserProfileSerializer(instance =  self.request.user, data = self.request.data, partial = True)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response(serializer.data)

class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serilizer = PasswordChangeSerializer(instance =  self.request.user, data = self.request.data, partial = True)
        
