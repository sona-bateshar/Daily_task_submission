from .models import Company, CompanyProfile, Branch, Department, Role
from rest_framework import  serializers

class BaseModelSerializer(serializers.ModelSerializer):
    
    def get_field_company(self):
        return self.request.user.company
    
    def save(self, **kwargs):
        """
        Overrides the save method to automatically set the company field
        before the object is created.
        """
        user = self.context['request'].user
        
        # Add the company from the user's profile to the save arguments.
        kwargs['company'] = user.users_company_profile.company
        
        # Call the parent class's save method, passing the modified arguments.
        return super().save(**kwargs)
    



class CompanyProfileSerializer(BaseModelSerializer):
    # These fields will be used for nested, read-only representation in API responses
    company_details = serializers.SerializerMethodField()
    branch_details = serializers.SerializerMethodField()
    department_details = serializers.SerializerMethodField()
    role_details = serializers.SerializerMethodField()
    parent_details = serializers.SerializerMethodField()

    class Meta:
        model = CompanyProfile
        read_only = ["user", "email", "first_name","middle_name" ,"last_name" ,"date_joined",  "company", "branch", "department", "role", "parent", "full_name" ]
        exclude = ["is_active"]
    
    # Custom methods for fetching the nested data for each foreign key
    def get_company_details(self, obj):
        if obj.company:
            return {"id": obj.company.id, "name": obj.company.name}
        return None

    def get_branch_details(self, obj):
        if obj.branch:
            return {"id": obj.branch.id, "name": obj.branch.name}
        return None
    
    def get_department_details(self, obj):
        if obj.department:
            return {"id": obj.department.id, "name": obj.department.name}
        return None

    def get_role_details(self, obj):
        if obj.role:
            return {"id": obj.role.id, "name": obj.role.name}
        return None
    
    def get_parent_details(self, obj):
        if obj.parent:
            return {"id": obj.parent.id, "full_name": obj.parent.full_name}
        return None
        

