from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin 
from .models import customUser 



@admin.register(customUser)
class UserAdmin(BaseUserAdmin):
    # These are the fields displayed in the list view of users in the admin
    list_display = [field.name for field in customUser._meta.fields]

    # These are the fields used for searching in the admin list view
    search_fields = ('username', 'email', 'first_name', 'last_name')

    # These are the fields used for filtering in the admin list view
    list_filter = ('is_staff', 'is_active', 'date_joined', 'company', 'branch', 'department')


