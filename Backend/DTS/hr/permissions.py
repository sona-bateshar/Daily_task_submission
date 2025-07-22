from rest_framework import permissions

class UserPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj):
        return obj.company == request.user.company

    def has_permission(self, request, view):
        user = request.user
        if request.method == 'POST':
            return user.access_level == 'admin'

        if request.method in ['GET', 'PUT', 'PATCH']:
            return user.access_level == 'admin' or user.access_level == 'hr'

        if request.method == 'DELETE':
            return user.access_level == 'admin'

        return False
