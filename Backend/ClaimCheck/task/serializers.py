# your_app/serializers.py
from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

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