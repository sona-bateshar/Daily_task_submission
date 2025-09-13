from import_export import resources, fields
from import_export.widgets import DateWidget, BooleanWidget, Widget, ForeignKeyWidget
from company.models import CompanyProfile
from .models import Task, Review , Comment
import json


class EmailListWidget(Widget):
    """Custom widget to handle comma-separated email strings and convert to user IDs"""
    
    def clean(self, value, row=None, **kwargs):
        if not value:
            return []
        
        # Handle both string and list inputs
        if isinstance(value, str):
            emails = [email.strip() for email in value.split(',') if email.strip()]
        elif isinstance(value, list):
            emails = value
        else:
            return []
        
        # Find CompanyProfile objects by email
        profiles = []
        for email in emails:
            try:
                profile = CompanyProfile.objects.get(email=email)
                profiles.append(profile.id)
            except CompanyProfile.DoesNotExist:
                # Log or handle missing profiles as needed
                print(f"Warning: CompanyProfile with email {email} not found")
                continue
        
        return profiles
    
    
    
    def render(self, value, obj=None, *args, **kwargs):
        """Render the value for export"""
        if not value:
            return ""
        
        try:
            # If value is a queryset or list of objects
            if hasattr(value, 'all'):  # QuerySet
                emails = [profile.email for profile in value.all()]
                return ', '.join(emails)
            elif isinstance(value, list):
                # List of IDs or objects
                emails = []
                for item in value:
                    if hasattr(item, 'email'):
                        emails.append(item.email)
                    else:
                        # Assume it's an ID
                        try:
                            profile = CompanyProfile.objects.get(id=item)
                            emails.append(profile.email)
                        except CompanyProfile.DoesNotExist:
                            continue
                return ', '.join(emails)
        except Exception:
            pass
        
        return str(value) if value else ""

class SingleEmailWidget(Widget):
    """Custom widget to handle single email and convert to CompanyProfile instance"""
    
    def clean(self, value, row=None, **kwargs):
        if not value:
            return None
        
        try:
            profile = CompanyProfile.objects.get(email=value.strip())
            return profile  # Return the instance, not the ID
        except CompanyProfile.DoesNotExist:
            print(f"Warning: CompanyProfile with email {value} not found")
            return None
    
    def render(self, value, obj=None, *args, **kwargs):
        """Render the value for export"""
        if not value:
            return ""
        try:
            if hasattr(value, 'email'):
                return value.email
            else:
                # If value is an ID, get the email
                profile = CompanyProfile.objects.get(id=value)
                return profile.email
        except (CompanyProfile.DoesNotExist, AttributeError):
            return str(value)

class ActionsRequiredWidget(Widget):
    """Custom widget to handle actions_required JSON field"""
    
    def clean(self, value, row=None, **kwargs):
        if not value:
            return []
        
        if isinstance(value, str):
            try:
                # Try to parse as JSON string
                return json.loads(value)
            except json.JSONDecodeError:
                return []
        elif isinstance(value, list):
            return value
        else:
            return []
    
    def render(self, value, obj=None, *args, **kwargs):
        """Render the value for export"""
        if not value:
            return ""
        
        if isinstance(value, (list, dict)):
            return json.dumps(value)
        return str(value)

class TaskResource(resources.ModelResource):
    # Define fields with custom widgets
    owner_email = fields.Field(
        column_name='owner_email',
        attribute='owner',
        widget=SingleEmailWidget()
    )
    
    assignees_emails = fields.Field(
        column_name='assignees_emails',
        attribute='_assignees_temp',
        widget=EmailListWidget()
    )
    
    supporting_staff_emails = fields.Field(
        column_name='supporting_staff_emails',
        attribute='_supporting_staff_temp',
        widget=EmailListWidget()
    )
    
    actions_required = fields.Field(
        column_name='actions_required',
        attribute='actions_required',
        widget=ActionsRequiredWidget()
    )
    
    due_date = fields.Field(
        column_name='due_date',
        attribute='due_date',
        widget=DateWidget(format='%Y-%m-%d')
    )
    
    discarted = fields.Field(
        column_name='discarted',
        attribute='discarted',
        widget=BooleanWidget()
    )
    
    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'actions_required',
            'owner_email', 'assignees_emails', 'supporting_staff_emails',
            'status', 'due_date', 'discarted'
        )


        # Remove import_id_fields if your CSV doesn't have an 'id' column
        # Or make sure your CSV/JSON has an 'id' column
        import_id_fields = ('id',)
        skip_unchanged = True
        report_skipped = True

        export_fields = ['id', 'title', 'description', 
                         'actions_required',
                        'owner__email', 'get_assignees__email',
                        'status', 'due_date', 'discarted']
    
    def before_import_row(self, row, **kwargs):
        """Pre-process row data before import"""
        # Ensure empty strings are converted to appropriate defaults
        if not row.get('supporting_staff_emails'):
            row['supporting_staff_emails'] = []
        if not row.get('assignees_emails'):
            row['assignees_emails'] = []
        if not row.get('actions_required'):
            row['actions_required'] = []
    
    def after_save_instance(self, instance, *args, **kwargs):
        """Handle many-to-many relationships after saving the instance"""
        # Extract dry_run from kwargs if available
        dry_run = kwargs.get('dry_run', False)
        
        if not dry_run:
            # Handle assignees many-to-many relationship
            if hasattr(self, '_assignees_ids') and self._assignees_ids:
                assignee_objects = CompanyProfile.objects.filter(id__in=self._assignees_ids)
                instance.assignees.set(assignee_objects)
            
            # Handle supporting_staff many-to-many relationship
            if hasattr(self, '_supporting_staff_ids') and self._supporting_staff_ids:
                support_objects = CompanyProfile.objects.filter(id__in=self._supporting_staff_ids)
                instance.supporting_staff.set(support_objects)
    
    def before_save_instance(self, instance, *args, **kwargs):
        """Store many-to-many data before saving instance"""
        # Get the cleaned values from the widgets
        assignees_value = getattr(instance, '_assignees_temp', [])
        supporting_staff_value = getattr(instance, '_supporting_staff_temp', [])
        
        # Store for later processing
        self._assignees_ids = assignees_value if isinstance(assignees_value, list) else []
        self._supporting_staff_ids = supporting_staff_value if isinstance(supporting_staff_value, list) else []

# Custom Widget for ForeignKey lookups on CompanyProfile using its email
class CompanyProfileForeignKeyWidget(ForeignKeyWidget):
    def get_queryset(self, value, row, *args, **kwargs):
        return self.model.objects.filter(email=value)
    
    def clean(self, value, row=None, **kwargs):
        if not value:
            return None
        return super().clean(value, row, **kwargs)

class ReviewResource(resources.ModelResource):
    reviewer = fields.Field(
        column_name='reviewer_email',
        attribute='reviewer',
        widget=CompanyProfileForeignKeyWidget(CompanyProfile, 'email')
    )

    class Meta:
        model = Review
        fields = (
            'id', 'task', 'reviewer', 'rating', 'description',
        )
        export_order = (
            'id', 'task', 'reviewer', 'rating', 'description',
        )

class CommentResource(resources.ModelResource):
    user = fields.Field(
        column_name='user_email',
        attribute='user',
        widget=CompanyProfileForeignKeyWidget(CompanyProfile, 'email')
    )

    class Meta:
        model = Comment
        fields = (
            'id', 'task', 'user', 'description',
        )
        export_order = (
            'id', 'task', 'user', 'description',
        )

