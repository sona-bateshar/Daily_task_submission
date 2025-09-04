# your_app/admin.py
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Task, Review, TaskUpdates
from .resources import TaskResource, ReviewResource, TaskUpdatesResource

# @admin.register(Task)
# class TaskAdmin(ImportExportModelAdmin):
#     resource_class = TaskResource
#     list_display = (
#         'id', 'title', 'owner','assignees', 'supporting_staff', 'status', 'due_date', 'discarted', 'created_at'
#     )
#     list_filter = ('status', 'discarted', 'due_date')
#     search_fields = ('title', 'owner__email', 'assignees__email')
#     raw_id_fields = ('owner', 'assignees', 'supporting_staff')
#     readonly_fields = ('closed_at',)

# admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from django.utils import timezone
from import_export.admin import ImportExportModelAdmin
from .models import Task
from .resources import TaskResource

@admin.register(Task)
class TaskAdmin(ImportExportModelAdmin):
    resource_class = TaskResource
    
    # Fixed list_display - removed M2M fields and added methods
    list_display = (
        'id', 
        'title', 
        'owner',
        'get_assignees', 
        'get_supporting_staff', 
        'status', 
        'due_date', 
        'discarted', 
        'created_at'
    )
    
    list_filter = (
        'status', 
        'discarted', 
        'due_date', 
        'created_at',
        'assignees',
        'supporting_staff'
    )
    
    search_fields = (
        'title', 
        'description',
        'owner__email', 
        'assignees__email',
        'supporting_staff__email'
    )
    
    # Use filter_horizontal for better M2M field editing
    filter_horizontal = ('assignees', 'supporting_staff')
    
    # Remove raw_id_fields for M2M fields - use filter_horizontal instead
    raw_id_fields = ('owner',)
    
    readonly_fields = ('created_at', 'updated_at', 'closed_at')
    
    # Organize fields in fieldsets
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'status', 'due_date', 'discarted')
        }),
        ('People', {
            'fields': ('owner', 'assignees', 'supporting_staff')
        }),
        ('Actions', {
            'fields': ('actions_required',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'closed_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Optimize queries
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'owner'
        ).prefetch_related(
            'assignees', 
            'supporting_staff'
        ).annotate(
            assignee_count=Count('assignees', distinct=True),
            support_count=Count('supporting_staff', distinct=True)
        )
    
    # Custom methods to display M2M fields
    def get_assignees(self, obj):
        """Display assignees as comma-separated list"""
        assignees = list(obj.assignees.all()[:3])
        if not assignees:
            return "No assignees"
        
        print( "assignees",  assignees)
        result = ", ".join([
            assignee.full_name or assignee.user.username 
            for assignee in assignees
        ])
        
        total_count = getattr(obj, 'assignee_count', obj.assignees.count())
        if total_count > 3:
            result += f" (+{total_count - 3} more)"
        
        return result
    get_assignees.short_description = 'Assignees'
    
    def get_supporting_staff(self, obj):
        """Display supporting staff as comma-separated list"""
        support_staff = list(obj.supporting_staff.all()[:3])
        if not support_staff:
            return "No support staff"
        
        result = ", ".join([
            staff.full_name or staff.user.username 
            for staff in support_staff
        ])
        
        total_count = getattr(obj, 'support_count', obj.supporting_staff.count())
        if total_count > 3:
            result += f" (+{total_count - 3} more)"
        
        return result
    get_supporting_staff.short_description = 'Supporting Staff'
    
    # Custom actions
    actions = ['mark_as_closed', 'mark_as_open', 'mark_as_discarded']
    
    def mark_as_closed(self, request, queryset):
        """Mark selected tasks as closed"""
        updated = 0
        for task in queryset:
            if task.status != 'closed':
                task.status = 'closed'
                task.closed_at = timezone.now()
                task.save()
                updated += 1
        
        self.message_user(
            request, 
            f'{updated} task(s) were successfully marked as closed.'
        )
    mark_as_closed.short_description = "Mark selected tasks as closed"
    
    def mark_as_open(self, request, queryset):
        """Mark selected tasks as open"""
        updated = queryset.exclude(status='open').update(
            status='open', 
            closed_at=None
        )
        self.message_user(
            request, 
            f'{updated} task(s) were successfully marked as open.'
        )
    mark_as_open.short_description = "Mark selected tasks as open"
    
    def mark_as_discarded(self, request, queryset):
        """Mark selected tasks as discarded"""
        updated = queryset.update(discarted=True)
        self.message_user(
            request, 
            f'{updated} task(s) were successfully marked as discarded.'
        )
    mark_as_discarded.short_description = "Mark selected tasks as discarded"
    
    # Custom list display with colors
    def get_list_display(self, request):
        """Customize list display based on user permissions"""
        if request.user.is_superuser:
            return self.list_display + ('get_actions_count',)
        return self.list_display
    
    def get_actions_count(self, obj):
        """Display count of actions required"""
        if obj.actions_required:
            count = len(obj.actions_required)
            if count > 0:
                return format_html(
                    '<span style="background: #ffc107; color: #000; '
                    'padding: 2px 6px; border-radius: 3px; font-size: 11px;">'
                    '{} action(s)</span>', 
                    count
                )
        return "No actions"
    get_actions_count.short_description = 'Actions Required'
    
    # Override save_model to handle custom logic
    def save_model(self, request, obj, form, change):
        """Custom save logic"""
        # Set owner if not set and user has company profile
        if not change and not obj.owner and hasattr(request.user, 'company_profile'):
            obj.owner = request.user.company_profile
        
        super().save_model(request, obj, form, change)

@admin.register(Review)
class ReviewAdmin(ImportExportModelAdmin):
    resource_class = ReviewResource
    list_display = (
        'id', 'task', 'reviewer', 'rating', 'created_at'
    )
    list_filter = ('rating', 'created_at')
    search_fields = ('task__title', 'reviewer__email')
    raw_id_fields = ('task', 'reviewer')

@admin.register(TaskUpdates)
class TaskUpdatesAdmin(ImportExportModelAdmin):
    resource_class = TaskUpdatesResource
    list_display = (
        'id', 'task', 'user', 'created_at'
    )
    list_filter = ('created_at',)
    search_fields = ('task__title', 'user__email')
    raw_id_fields = ('task', 'user')

# Make sure to also import and register any other admin classes
# from the previous code if they are in the same admin.py file.
# from .models import Company, Branch, ...
# @admin.register(Company)
# ...
