# myapp/permissions.py
from rest_framework import permissions

class CompanyModelPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False
        elif request.user.groups.filter(name='admin').exists():
            return obj == request.user.company
        elif request.user.groups.filter(name='hr').exists():
            return obj == request.user.company
        else:
            return False

    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
    
        if not request.user:
            return False
        if action:
            if request.user.groups.filter(name='admin').exists():
                return view.action in ['retrieve', 'update', 'partial_update']
            elif request.user.groups.filter(name='hr').exists():
                return view.action in ['retrieve', 'update', 'partial_update']
            else:
                return view.action in ['retrieve']


        else:
        
            if request.user.groups.filter(name='admin').exists():
                return request.method in ['GET', 'PUT', 'PATCH']
            elif request.user.groups.filter(name='hr').exists():
                return request.method in ['GET', 'PUT', 'PATCH']
            else:
                return request.method in ['GET']

class BranchModelPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False
        elif request.user.groups.filter(name='admin').exists():
            return obj.company == request.user.company
        elif request.user.groups.filter(name='hr').exists():
            return obj.company == request.user.company
        else:
            return obj == request.user.branch

    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
    
        if not request.user:
            return False
        if action:
            if request.user.groups.filter(name='admin').exists():
                return True
            elif request.user.groups.filter(name='hr').exists():
                return view.action in ['list', 'retrieve', 'update', 'partial_update']
            else:
                return view.action in ['retrieve']

        else:
            if request.user.groups.filter(name='admin').exists():
                return True
            elif request.user.groups.filter(name='hr').exists():
                return request.method in ['GET', 'PUT', 'PATCH']
            else:
                return request.method in ['GET']

class DepartmentModelPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False
        elif request.user.groups.filter(name='admin').exists():
            return obj.company == request.user.company
        elif request.user.groups.filter(name='hr').exists():
            return obj.company == request.user.company
        else:
            return obj == request.user.department

    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
    
        if not request.user:
            return False
        if action:
            if request.user.groups.filter(name='admin').exists():
                return True
            elif request.user.groups.filter(name='hr').exists():
                return view.action in ['list', 'retrieve', 'update', 'partial_update']
            else:
                return view.action in ['retrieve']

        else:
            if request.user.groups.filter(name='admin').exists():
                return True
            elif request.user.groups.filter(name='hr').exists():
                return request.method in ['GET', 'PUT', 'PATCH']
            else:
                return request.method in ['GET']

class RoleModelPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False
        elif request.user.groups.filter(name='admin').exists():
            return obj.company == request.user.company
        elif request.user.groups.filter(name='hr').exists():
            return obj.company == request.user.company
        else:
            return obj == request.user.role

    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
    
        if not request.user:
            return False
        if action:
            if request.user.groups.filter(name='admin').exists():
                return True
            elif request.user.groups.filter(name='hr').exists():
                return view.action in ['list', 'retrieve', 'update', 'partial_update']
            else:
                return view.action in ['retrieve']

        else:
            if request.user.groups.filter(name='admin').exists():
                return True
            elif request.user.groups.filter(name='hr').exists():
                return request.method in ['GET', 'PUT', 'PATCH']
            else:
                return request.method in ['GET']
