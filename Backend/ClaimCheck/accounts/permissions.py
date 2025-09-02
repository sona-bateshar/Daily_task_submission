# myapp/permissions.py
from rest_framework import permissions

class UserModelPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj): 
        if request.user:
            if obj == request.user:
                return True
            
            user_company = None
            object_company = None
            try:
                user_company = request.user.users_company_profile.company
                object_company = obj.users_company_profile.company
            except:
                pass
            
            if user_company:
                if request.user.groups.filter(name='admin').exists():
                    return user_company == object_company
                elif request.user.groups.filter(name='hr').exists():
                    return user_company == object_company
        
        return False

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
                return view.action in ['retrieve', 'update', 'partial_update']


        else:
        
            if request.user.groups.filter(name='admin').exists():
                return True
            
            elif request.user.groups.filter(name='hr').exists():
                return request.method in ['GET', 'PUT', 'PATCH']
            else:
                return request.method in ['GET', 'PUT', 'PATCH']
            