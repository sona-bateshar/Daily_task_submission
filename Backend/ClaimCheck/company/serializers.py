from rest_framework import serializers

class BaseModelSerializer(serializers.ModelSerializer):
    
    def get_field_company(self):
        return self.request.user.company
    

