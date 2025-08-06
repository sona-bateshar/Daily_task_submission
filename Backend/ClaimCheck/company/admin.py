from django.contrib import admin
from .models import CompanyProfile, Company, Branch, Department, Role
from django.db.models import ManyToManyField, ForeignObjectRel



@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = [field.name for field in CompanyProfile._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Company._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]



@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Branch._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]



@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Department._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Role._meta.get_fields() if not isinstance(field, (ManyToManyField, ForeignObjectRel))]

