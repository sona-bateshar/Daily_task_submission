# from rest_framework import serializers
# from .models import Company, Branch, Department, Role # Assuming customUser is your user model

# # Re-include existing serializers for clarity if needed
# class CompanySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Company
#         fields = '__all__'

# class BranchSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Branch
#         fields = '__all__'
#         read_only_fields = ['company']

# class DepartmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Department
#         fields = '__all__'
#         read_only_fields = ['company']

# class RoleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Role
#         fields = '__all__'
#         read_only_fields = ['company']