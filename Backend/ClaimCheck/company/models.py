from django.db import models
from datetime import date 
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
User = get_user_model()

class CompanyProfile(models.Model):
    """
    Extends the existing AUTH_USER_MODEL with company-specific fields and methods.
    This uses a OneToOneField to link directly to the User instance.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='users_company_profile', 
        help_text="The user associated with this company profile user instance."
    )
    email = models.EmailField(max_length=150, unique=True, blank=False, null=False, db_index = True) # Ensure email is unique and required
    
    first_name = models.CharField(max_length=150, blank=False, null=False)
    middle_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=False, null=False)

    phone_number = models.CharField(max_length=20, blank=True, null=True, unique=True) # Optional, can be unique
    date_of_birth = models.DateField(blank=True, null=True)
    date_joined = models.DateField(blank=True, null=True, default=date.today) # Default to today if not provided
    
    is_active = models.BooleanField(
        default=True,
        help_text="Indicates whether the user is active or not."
    )
    company = models.ForeignKey(
        'company.Company',
        on_delete=models.CASCADE, 
        null=True,                 
        blank=True,                
        related_name='users'       
    )

    branch = models.ForeignKey(
        'company.Branch',
        on_delete=models.SET_NULL, 
        null=True,                 
        blank=True,                
        related_name='users'       
    )

    role = models.ForeignKey(
        'company.Role',
        on_delete=models.PROTECT, 
        null=True,                 
        blank=True,                
        related_name='users'       
    )

    department = models.ForeignKey(
        'company.Department',
        on_delete=models.PROTECT, 
        null=True,                 
        blank=True,                
        related_name='users'       
    )

    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL, 
        null=True,                 
        blank=True,                
        related_name='children'    
    )

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name'] # You can keep username as a required field during creation

    @property
    def full_name(self):
        return f"{self.first_name} {self.middle_name if self.middle_name else ''} {self.last_name}".strip()
    
    def clean(self):
        super().clean()
        if self.branch and self.branch.company != self.company:
            raise ValidationError("User's branch must belong to the user's company.")
        if self.role and self.role.company != self.company:
            raise ValidationError("User's role must belong to the user's company.") 
        if self.department and self.department.company != self.company:
            raise ValidationError("User's department must belong to the user's company.")
        if self.parent and self.parent.company != self.company:
            raise ValidationError("User's parent must belong to the user's company.")
        if self.parent and self.parent == self:
            raise ValidationError("User cannot be their own manager.")
    
    def save(self, *args, **kwargs):
        if self.user:
            if self.company:
                self.user.is_active = self.is_active and self.company.is_active
            else:
                self.user.is_active = self.is_active
            self.user.save()  
        super().save(*args, **kwargs)

    def __str__(self):
        if self.full_name:
            return self.full_name
        else :
            return self.user.username
        # return self.full_name if self.full_name else self.user.username
    
    @property
    def get_ancestors(self):
        """
        Returns a list of all ancestors of the user in the hierarchy.
        """
        ancestors = []

        if self.parent:
            current = self.parent
        elif self.department :
            current = self.department.head
        elif self.company:
            current = self.company.head  
        else:
            None
        
        while current:
            ancestors.append(current)
            current = current.parent
        return ancestors
    
    @property
    def get_children(self):
        """
        Returns a list of all direct children of the user in the hierarchy.
        """
        return list(self.children.all())
    

    @property
    def get_descendants(self):
        """
        Returns a list of all descendants of the user in the hierarchy.
        """
        descendants = []

        def _get_descendants(user):
            for child in user.children.all():
                descendants.append(child)
                _get_descendants(child)

        _get_descendants(self)
        return descendants
    


class Company(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False, db_index=True)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True, unique=True)
    is_active = models.BooleanField(default=True, help_text="Indicates whether the company is active or not.")
    head = models.OneToOneField(
        'company.CompanyProfile', 
        on_delete=models.SET_NULL,
        blank=True, 
        null=True,
        related_name='headed_companies'  
    )

    class Meta:
        verbose_name_plural = "Companies" 
        

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save the company first

        # Update is_active of each associated user
        for profile in self.users.all():  # self.users is the reverse FK from UserCompanyProfile to Company
            user = profile.user
            user.is_active = profile.is_active and self.is_active
            user.save()


class Branch(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    head = models.OneToOneField(
        'company.CompanyProfile', 
        on_delete=models.SET_NULL,
        blank=True, 
        null=True,
        related_name='headed_branches'  
    )

    company = models.ForeignKey(
        'company.Company',
        on_delete=models.CASCADE,               
        related_name='branches'
    )

    class Meta:
        verbose_name_plural = "Branches" # Correct pluralization for admin
        unique_together = ('company', 'name')

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    
    head = models.OneToOneField(
        'company.CompanyProfile', 
        on_delete=models.SET_NULL,
        blank=True, 
        null=True,
        related_name='headed_departments'

    )

    company = models.ForeignKey(
        'company.Company',
        on_delete=models.CASCADE,               
        related_name='departments'    
    )

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "departments" # Correct pluralization for admin
        unique_together = ('company', 'name')



class Role(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    company = models.ForeignKey(
        'company.Company',
        on_delete=models.CASCADE,               
        related_name='roles'       
    )

    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural = "roles" # Correct pluralization for admin
        unique_together = ('company', 'name')


"""

refer this for setting a field

| **Field**          | **Explanation**                                      | **Default Value**               | **Other Values**                        | **Example Use Case**                                             |
| ------------------ | ---------------------------------------------------- | ------------------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `verbose_name`     | Human-readable name for forms/admin.                 | Auto-generated from field name. | Any string.                             | `verbose_name="User name"` for better admin display.             |
| `name`             | Internal name of the field, auto-set by Django.      | Auto-handled.                   | Not set manually.                       | Used internally in migrations and queries.                       |
| `primary_key`      | Makes field the primary key.                         | `False`                         | `True`                                  | Use in `id = models.CharField(primary_key=True)` for custom PKs. |
| `max_length`       | Maximum character length (required in `CharField`).  | *No default* (required)         | Any int > 0                             | `max_length=100` for name or email fields.                       |
| `db_collation`     | DB collation for sorting and comparison.             | `None` (uses DB default)        | e.g. `'utf8_general_ci'`                | Set for case-insensitive sorting.                                |
| `unique`           | Ensures all field values are unique.                 | `False`                         | `True`                                  | Use in `email = models.CharField(unique=True)`                   |
| `blank`            | Allows blank value in forms.                         | `False`                         | `True`                                  | `blank=True` for optional form fields.                           |
| `null`             | Allows `NULL` in the database.                       | `False`                         | `True` (for nullable fields)            | `null=True` for optional DB fields.                              |
| `db_index`         | Adds a database index for faster lookup.             | `False`                         | `True`                                  | Index frequently queried fields like `username`.                 |
| `default`          | Default Python-side value or callable.               | `None`                          | e.g., `'N/A'`, `timezone.now`           | `default='Active'` or `default=datetime.now`                     |
| `db_default`       | Default value enforced by DB engine.                 | `None`                          | Literal or `Func`                       | `db_default=Value('Active')`                                     |
| `editable`         | Whether field appears in admin/forms.                | `True`                          | `False`                                 | Use `editable=False` for auto fields like `slug`.                |
| `auto_created`     | Used internally for fields auto-generated by Django. | `False`                         | `True`                                  | Not used in user-defined models.                                 |
| `serialize`        | Whether field is included in serialization.          | `True`                          | `False`                                 | `serialize=False` for fields used only internally.               |
| `unique_for_date`  | Ensures uniqueness per day for another date field.   | `None`                          | Field name as string                    | `title`, `unique_for_date='publish_date'`                        |
| `unique_for_month` | Same as above, scoped to month.                      | `None`                          | Field name as string                    | Useful in news/blog titles per month.                            |
| `unique_for_year`  | Same as above, scoped to year.                       | `None`                          | Field name as string                    | Prevent same slug in a year.                                     |
| `choices`          | Restricts to predefined values.                      | `None`                          | Tuple list or `TextChoices` enum        | `choices=[('M', 'Male'), ('F', 'Female')]`                       |
| `help_text`        | Additional info shown in forms.                      | `''`                            | Any string                              | `help_text='Enter full legal name'`                              |
| `db_column`        | Overrides DB column name.                            | `None` (uses field name)        | Any string                              | `db_column='user_name'` for legacy DBs.                          |
| `db_comment`       | Adds DB comment for field (if DB supports it).       | `None`                          | Any string                              | `db_comment='Primary contact email'`                             |
| `db_tablespace`    | Name of DB tablespace for the column.                | `None`                          | Tablespace string                       | Used in custom DB setups.                                        |
| `validators`       | List of validator callables.                         | `[]`                            | List of functions                       | `validators=[MinLengthValidator(5)]`                             |
| `error_messages`   | Custom error messages for validation.                | Auto-generated                  | Dict like `{'required': 'Name needed'}` | Use to customize user feedback on forms.                         |




"""

# Create your models here.
