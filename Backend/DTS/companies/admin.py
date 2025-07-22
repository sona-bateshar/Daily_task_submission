from django.contrib import admin
from .models import Company, Branch, Role, Department




@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'head', 'phone', 'address')
    search_fields = ('name', 'address', 'phone')
    # Using autocomplete_fields for ForeignKey/OneToOneField improves UX
    # especially with many users. 'admin' points to your customUser model.
    # For autocomplete to work, customUser's admin class MUST have 'search_fields' defined.
    autocomplete_fields = ('head',) 
    
    # If you want the 'admin' field to be set only once and then read-only:
    # readonly_fields = ('admin',)

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'head', 'phone', 'address')
    search_fields = ('name', 'phone', 'company__name') # Search by company name
    list_filter = ('company', 'company__name') # Filter by company
    autocomplete_fields = ('head','company') # 'head' points to your customUser model

    # 'company' field is set as editable=False in the model.
    # This means it won't appear in the regular admin form fields.
    # If you want it to be visible in the admin form (but not editable):
    # readonly_fields = ('company',) 
    # Otherwise, it's expected to be set programmatically or via inlines.

    # Optional: If you want to add Branch inline to Company admin
    # This makes sense because Branch has a ForeignKey to Company
    # and 'editable=False' on company in Branch implies it's set by the parent.
    # (See example for CompanyAdmin below)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'head', 'description')
    search_fields = ('name', 'company__name')
    list_filter = ('company', 'company__name')
    autocomplete_fields = ('head',)
    readonly_fields = ('company',)

# --- 4. Registering Role Model ---
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'description')
    search_fields = ('name', 'description', 'company__name')
    list_filter = ('company',)
    readonly_fields = ('company',)


# --- Optional: Customizing your customUser Admin for better autocomplete ---
# (This assumes customUser is in accounts/models.py and you're using a custom UserAdmin)
# If customUser is your AUTH_USER_MODEL, you likely have a custom admin class for it.
# Ensure it has search_fields defined for autocomplete_fields to work above.

# Example: If your customUser admin class is called CustomUserAdmin
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# class CustomUserAdmin(BaseUserAdmin):
#     # ... your existing customUser admin config ...
#     search_fields = ('username', 'email', 'first_name', 'last_name') # Essential for autocomplete_fields

# # Re-register your customUser with its custom admin class if you previously did.
# # admin.site.unregister(customUser) # Uncomment if customUser was already registered by default
# # admin.site.register(customUser, CustomUserAdmin)
