from gc import get_objects
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import TaskModelPermission
# from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TaskModelPermission ]
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    # filter_backends = [DjangoFilterBackend]


    ordering_fields = '__all__'
    ordering = ['due_date']

    def get_queryset(self):
        """
        Dynamically filters the Task queryset based on URL query parameters,
        handling the new, more complex filtering logic.
        """

        queryset = Task.objects.filter(**self.request.GET.dict())
        user = self.request.user
    
        request = self.request
        allowed_ids = []
        for obj in queryset:
            try:
                self.check_object_permissions(request, obj)
                allowed_ids.append(obj.pk)
            except PermissionDenied:
                continue
        queryset = queryset.filter(pk__in=allowed_ids)

        # Now filter the base queryset using the allowed IDs
        return queryset
    

    def get_object(self):
        """
        Retrieve a single object for retrieve, update, destroy actions.
        This method is designed to first find the object, then apply object permissions.
        """
        # 1. Get the primary key from the URL
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        pk = self.kwargs[lookup_url_kwarg]
        obj = get_object_or_404(super().get_queryset(), **{self.lookup_field: pk})

        # 3. Check object-level permissions using DRF's built-in mechanism.
        # This calls has_object_permission() from your UserPermission.
        # If permission is denied, it will raise PermissionDenied (403).

        print(obj, self.request.data)
        self.check_object_permissions(self.request, obj)

        return obj

