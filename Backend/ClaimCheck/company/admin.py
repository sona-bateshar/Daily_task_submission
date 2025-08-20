# your_app/admin.py
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import CompanyProfile, Company, Branch, Department, Role
from .resources import UserResource, CompanyProfileResource, CompanyResource, BranchResource, DepartmentResource, RoleResource
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Unregister the default UserAdmin
admin.site.unregister(User)

# Define your custom UserAdmin
@admin.register(User)
class MyUserAdmin(ImportExportModelAdmin, BaseUserAdmin):
    resource_class = UserResource
    list_display = (
        'id', 'username', 'email', 'first_name', 'last_name', 
        'is_staff', 'is_active', 'is_superuser', 'date_joined'
    )
    list_filter = BaseUserAdmin.list_filter + ('is_superuser', 'is_active', 'is_staff')

@admin.register(CompanyProfile)
class CompanyProfileAdmin(ImportExportModelAdmin):
    resource_class = CompanyProfileResource
    list_display = (
        'id', 'email', 'get_full_name', 'company', 'branch', 'role',
        'department', 'is_active', 'parent'
    )
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('company', 'branch', 'role', 'department', 'is_active')
    raw_id_fields = ('user',)  # Use a raw ID field for the user to avoid a massive dropdown


@admin.register(Company)
class CompanyAdmin(ImportExportModelAdmin):
    resource_class = CompanyResource
    list_display = ('id', 'name', 'address', 'is_active', 'head',)
    search_fields = ('name',)
    list_filter = ('is_active',)


@admin.register(Branch)
class BranchAdmin(ImportExportModelAdmin):
    resource_class = BranchResource
    list_display = ('id', 'name', 'company', 'address', 'head',)
    search_fields = ('name',)
    list_filter = ('company',)


@admin.register(Department)
class DepartmentAdmin(ImportExportModelAdmin):
    resource_class = DepartmentResource
    list_display = ('id', 'name', 'company', 'head',)
    search_fields = ('name',)
    list_filter = ('company',)


@admin.register(Role)
class RoleAdmin(ImportExportModelAdmin):
    resource_class = RoleResource
    list_display = ('id', 'name', 'company',)
    search_fields = ('name',)
    list_filter = ('company',)

# from django.contrib import admin
# from .models import CompanyProfile, Company, Branch, Department, Role
# from django.db.models import ManyToManyField, ForeignObjectRel



# @admin.register(CompanyProfile)
# class CompanyProfileAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in CompanyProfile._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]


# @admin.register(Company)
# class CompanyAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Company._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]



# @admin.register(Branch)
# class BranchAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Branch._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]



# @admin.register(Department)
# class DepartmentAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Department._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]


# @admin.register(Role)
# class RoleAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Role._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]

