from .models import customUser
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = customUser
        fields = (
                    'id',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'phone_number',
                    'date_of_birth',
                    'date_joined',
                    'is_user_active',
                    'company',
                    'branch',
                    'role',
                    'department',
                    'password'
                )
        read_only_fields = (
                    'id',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'date_of_birth',
                    'date_joined',
                    'is_user_active',
                    'company',
                    'branch',
                    'role',
                    'department'
                )
    
class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change operations.

    This serializer handles validating the old password against the user's
    current password and ensuring the new passwords match and meet Django's
    password validation requirements.
    """
    old_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password1 = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    new_password2 = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        """
        Custom validation for the password change request.

        Args:
            data (dict): The validated data containing old_password, new_password1, and new_password2.

        Returns:
            dict: The validated data.

        Raises:
            serializers.ValidationError: If validation fails.
        """
        # Determine the user instance to operate on.
        user = self.instance 

        # 1. Validate old password
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is not correct."})

        # 2. Validate new passwords match
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({"new_password2": "New passwords do not match."})

        # 3. Validate new password against Django's password validators
        try:
            validate_password(data['new_password1'], user=user)
        except DjangoValidationError as e:
            # Convert Django's ValidationError to DRF's ValidationError
            raise serializers.ValidationError({"new_password1": list(e.messages)})

        # 4. Ensure new password is not the same as the old password
        if user.check_password(data['new_password1']):
            raise serializers.ValidationError({"new_password1": "New password cannot be the same as the old password."})

        return data

    def save(self, **kwargs):
        """
        Saves the new password for the user.

        Args:
            **kwargs: Additional keyword arguments (not used in this method).

        Returns:
            User: The updated user instance.
        """
        # Determine the user instance to operate on, consistent with validation logic.
        user = self.instance 
        new_password = self.validated_data['new_password1']

        # Set the new password and save the user
        user.set_password(new_password)
        user.save()

        return user

