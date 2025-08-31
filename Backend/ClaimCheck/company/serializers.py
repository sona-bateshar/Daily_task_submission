from rest_framework import serializers
from .models import Company, CompanyProfile, Branch, Department, Role

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
    class meta:
        read_only = ["user", "email", "first_name","middle_name" ,"last_name" ,"date_joined",  "company", "branch", "department", "role", "parent", "full_name" ]
        exclude = ["is_active"]
    
    def get_company(self):
        return {
            "id" : self.company.id, 
            "name": self.company.name
        }
    def get_department(self):
        return {
            "id" : self.department.id, 
            "name": self.department.name
        }
    def get_role(self):
        return {
            "id" : self.role.id, 
            "name": self.role.name
        }
    def get_parent(self):
        return {
            "id" : self.parent.id, 
            "name": self.parent.name
        }
    def get_user(self):
        return {
            "id" : self.user.id, 
            "name": self.user.username
        }
        
