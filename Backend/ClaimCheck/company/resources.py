# your_app/resources.py
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from django.contrib.auth import get_user_model
from .models import CompanyProfile, Company, Branch, Department, Role

User = get_user_model()


# your_app/resources.py
from django.contrib.auth.models import User
from import_export import resources

class UserResource(resources.ModelResource):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_staff', 'is_active', 'is_superuser', 'date_joined', 'password'
        )
        export_order = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_staff', 'is_active', 'is_superuser', 'date_joined', 'password'
        )

class CompanyResource(resources.ModelResource):
    head = fields.Field(
        column_name='head',
        attribute='head',
        widget=ForeignKeyWidget(CompanyProfile, 'email')
    )

    class Meta:
        model = Company
        fields = ('id', 'name', 'address', 'phone', 'is_active', 'head',)
        export_order = ('id', 'name', 'address', 'phone', 'is_active', 'head',)


class BranchResource(resources.ModelResource):
    company = fields.Field(
        column_name='company',
        attribute='company',
        widget=ForeignKeyWidget(Company, 'name')
    )
    head = fields.Field(
        column_name='head',
        attribute='head',
        widget=ForeignKeyWidget(CompanyProfile, 'email')
    )

    class Meta:
        model = Branch
        fields = ('id', 'name', 'address', 'phone', 'head', 'company',)
        export_order = ('id', 'name', 'address', 'phone', 'head', 'company',)


class DepartmentResource(resources.ModelResource):
    company = fields.Field(
        column_name='company',
        attribute='company',
        widget=ForeignKeyWidget(Company, 'name')
    )
    head = fields.Field(
        column_name='head',
        attribute='head',
        widget=ForeignKeyWidget(CompanyProfile, 'email')
    )

    class Meta:
        model = Department
        fields = ('id', 'name', 'description', 'head', 'company',)
        export_order = ('id', 'name', 'description', 'head', 'company',)


class RoleResource(resources.ModelResource):
    company = fields.Field(
        column_name='company',
        attribute='company',
        widget=ForeignKeyWidget(Company, 'name')
    )

    class Meta:
        model = Role
        fields = ('id', 'name', 'description', 'company',)
        export_order = ('id', 'name', 'description', 'company',)

# your_app/resources.py
from django.contrib.auth import get_user_model
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from .models import CompanyProfile, Company, Branch, Department, Role

User = get_user_model()

class UserForeignKeyWidget(ForeignKeyWidget):
    def get_queryset(self, value, row, *args, **kwargs):
        return self.model.objects.all()

class CompanyForeignKeyWidget(ForeignKeyWidget):
    def get_queryset(self, value, row, *args, **kwargs):
        return self.model.objects.filter(name=value)

# Custom widget to find Branch based on both name and company
class BranchForeignKeyWidget(ForeignKeyWidget):
    def get_queryset(self, value, row, *args, **kwargs):
        company_name = row.get('company')
        if not company_name:
            return self.model.objects.none()
        return self.model.objects.filter(name=value, company__name=company_name)

# Custom widget to find Department based on both name and company
class DepartmentForeignKeyWidget(ForeignKeyWidget):
    def get_queryset(self, value, row, *args, **kwargs):
        company_name = row.get('company')
        if not company_name:
            return self.model.objects.none()
        return self.model.objects.filter(name=value, company__name=company_name)

# Custom widget to find Role based on both name and company
class RoleForeignKeyWidget(ForeignKeyWidget):
    def get_queryset(self, value, row, *args, **kwargs):
        company_name = row.get('company')
        if not company_name:
            return self.model.objects.none()
        return self.model.objects.filter(name=value, company__name=company_name)

# Custom widget to find Role based on both name and company
class ParentForeignKeyWidget(ForeignKeyWidget):
    def get_queryset(self, value, row, *args, **kwargs):
        company_name = row.get('company')
        if not company_name:
            return self.model.objects.none()
        
        return self.model.objects.filter(email=value, company__name=company_name)

class CompanyProfileResource(resources.ModelResource):
    user = fields.Field(
        column_name='user',
        attribute='user',
        widget=UserForeignKeyWidget(User, 'username')
    )
    company = fields.Field(
        column_name='company',
        attribute='company',
        widget=CompanyForeignKeyWidget(Company, 'name')
    )
    branch = fields.Field(
        column_name='branch',
        attribute='branch',
        widget=BranchForeignKeyWidget(Branch, 'name')
    )
    department = fields.Field(
        column_name='department',
        attribute='department',
        widget=DepartmentForeignKeyWidget(Department, 'name')
    )
    role = fields.Field(
        column_name='role',
        attribute='role',
        widget=RoleForeignKeyWidget(Role, 'name')
    )
    parent = fields.Field(
        column_name='parent',
        attribute='parent',
        widget=ParentForeignKeyWidget(CompanyProfile, 'email')
    )

    class Meta:
        model = CompanyProfile
        import_id_fields = ['user']  # Use the unique 'user' field for lookup
        fields = (
            'user', 'email', 'first_name', 'middle_name', 'last_name',
            'phone_number', 'date_of_birth', 'date_joined', 'is_active',
            'company', 'branch', 'department', 'role', 'parent'
        )
        export_order = (
            'user', 'email', 'first_name', 'middle_name', 'last_name',
            'phone_number', 'date_of_birth', 'date_joined', 'is_active',
            'company', 'branch', 'department', 'role', 'parent'
        )
