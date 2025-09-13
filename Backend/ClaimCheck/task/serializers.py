# your_app/serializers.py
from rest_framework import serializers
from .models import Task, Comment
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.serializers import ValidationError


User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):
    # Use a SerializerMethodField for read-only relationships if needed
    # assignees = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    # supporting_staff = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())

    assignees_details = serializers.SerializerMethodField()
    supporting_staff_details = serializers.SerializerMethodField()
    owner_details = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__'

    def get_assignees_details(self, obj):
        assignees_details = []

        for assignee in obj.assignees.all():
            assignees_details.append( 
                {
                    "id" : assignee.id, 
                    "email" : assignee.email, 
                    "full_name": assignee.full_name
                }
            )
        
        return assignees_details
    
    def get_supporting_staff_details(self, obj):
        supporting_staff_details = []

        for staff in obj.supporting_staff.all():
            supporting_staff_details.append( 
                {
                    "id" : staff.id, 
                    "email" : staff.email, 
                    "full_name": staff.full_name
                }
            )
        
        return supporting_staff_details
    
    def get_owner_details(self, obj):
        if obj.owner:
            return {"id": obj.owner.id, "email" : obj.owner.email,  "full_name": obj.owner.full_name}
        return None
    
    def validate(self, data):
        """
        Validate that assignees and supporting staff belong to the owner's company.
        """
        # Get the instance being updated (if it exists) or use the data for a new instance.
        instance = self.instance
        
        # Get the owner from the data. If not provided (during an update), use the existing instance's owner.
        owner = data.get('owner', instance.owner if instance else None)

        if not owner:
            raise serializers.ValidationError({"owner": "A task must have an owner."})

        # Get the owner's company.
        # This assumes the User model has a `company` field.
        owner_company = owner.company

        # Validate assignees
        assignees = data.get('assignees', [])
        for assignee in assignees:
            if assignee.company != owner_company:
                raise serializers.ValidationError(
                    {"assignees": f"Assignee '{assignee.full_name}' does not belong to the owner's company."}
                )

        # Validate supporting staff
        supporting_staff = data.get('supporting_staff', [])
        for staff in supporting_staff:
            if staff.company != owner_company:
                raise serializers.ValidationError(
                    {"supporting_staff": f"Supporting staff member '{staff.full_name}' does not belong to the owner's company."}
                )

        # Prevent edits if the task is closed.
        if instance and instance.status == 'closed':
            raise serializers.ValidationError({"status": "Cannot edit a closed task."})

        return data


class CommentSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_user_details(self, obj):
        if obj.user:
            return {"id": obj.user.id, "email" : obj.user.email,  "full_name": obj.user.full_name}
        return None
    
    # def validate(self, data):
    #     """
    #     Validate that assignees and supporting staff belong to the owner's company.
    #     """
    #     task_id = data.get('task')
    #     if task_id is None:
    #         if self.instance:
    #             # We're updating, and the task field wasn't changed.
    #             # Use the existing task instance for validation.
    #             task = self.instance.task
    #         else:
    #             # We're creating a new object, and no task was provided.
    #             # This is an error, as the task field is likely required.
    #             raise ValidationError("Task ID is required.")
    #     else:
    #         # 3. A new task ID was provided, so fetch the corresponding instance.
    #         try:
    #             task = Task.objects.get(pk=task_id)
    #         except Task.DoesNotExist:
    #             raise ValidationError("Invalid task ID.")
            
    #     comment_user_id = data.get('user')
    #     if comment_user_id is None:
    #         if self.instance:
    #             comment_user = self.instance.user
    #         else:
    #             raise ValidationError("User ID is required.")
    #     else:
    #         try:
    #             comment_user = User.objects.get(pk=comment_user_id)
    #         except User.DoesNotExist:
    #             raise ValidationError("Invalid user ID.")


    #     task_users = (
    #             task.assignees.all()
    #             | task.supporting_staff.all()
    #             | User.objects.filter(pk=task.owner.pk) if task.owner else User.objects.none()
    #             | User.objects.filter(pk=task.owner.parent.pk) if task.owner and task.owner.parent else User.objects.none()
    #         )

    #     if not comment_user:
    #         raise serializers.ValidationError({"user": "A comment must have an user."})
        
    #     if not task:
    #         raise serializers.ValidationError({"task": "A comment must have a task."})
        
    #     if comment_user not in task_users:
    #         raise serializers.ValidationError({"user": "Comment can only be given by the task owner, assignee, or supporting staff"})

    #     # Prevent edits if the task is closed.
    #     if self.instance and self.instance.task and self.instance.task.status  == 'closed':
    #         raise serializers.ValidationError({"task": "Cannot edit a closed task's comment."})

    #     return data
    
