# myapp/permissions.py
from rest_framework import permissions

class TaskModelPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj):
        if request.user:
            try:
                user_company = request.user.users_company_profile.company
            except:
                return False
            
            if request.user.groups.filter(name='admin').exists():
                return obj.owner.company == user_company
            elif request.user.groups.filter(name='hr').exists():
                return obj.owner.company == user_company
            else:
                if request.method == "POST":
                    return True
        
                if request.method in ['PUT', 'PATCH']:
                    return request.user.users_company_profile == obj.owener
        
                elif request.method in ['GET']:
                    return request.user.users_company_profile == obj.owener \
                        or obj.assignees.filter(pk=request.user.users_company_profile.pk).exists() \
                        or obj.supporting_staff.filter(pk=request.user.users_company_profile.pk).exists() \
                        or obj.owener.parents.filter(pk=request.user.users_company_profile.pk).exists() 

        return False



    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
    
        if not request.user:
            return False
        
        if request.method in ['GET', 'POST', 'PUT', 'PATCH']:
            return True
        return False

class ReviewModelPermission(permissions.BasePermission):
    """
    Custom permission based on role and company.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user:
            return False
        
        if request.user.groups.filter(name__in=['admin', 'hr']).exists():
                return obj.owner.company == request.user.company

        if request.method == "POST":
            return True
        
        if request.method in ['PUT', 'PATCH']:
            return request.user == obj.reviewer
        
        if request.method in ['GET']:
            return request.user == obj.task.owener \
                or obj.task.assignees.filter(pk=request.user.pk).exists() \
                or obj.task.supporting_staff.filter(pk=request.user.pk).exists() \
                or obj.task.owener.parents.filter(pk=request.user.pk).exists() \
                or request.user == obj.reviewer

        return False



    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
    
        if not request.user:
            return False
        return True

