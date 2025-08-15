from rest_framework import serializers

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
    

