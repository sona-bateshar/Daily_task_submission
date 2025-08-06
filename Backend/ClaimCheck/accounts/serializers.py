from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, TokenBackendError
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change operations.

    This serializer handles validating the old password against the user's
    current password and ensuring the new passwords match and meet Django's
    password validation requirements.
    """
    old_password  = serializers.CharField(required=True, allow_blank=False, write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(required=True, allow_blank=False, write_only=True, style={'input_type': 'password'})
    # new_password2 = serializers.CharField(required=True, allow_blank=False, write_only=True, style={'input_type': 'password'})
    logout_from_all_devices = serializers.BooleanField(default = False)
    
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

        print('inside password view')
        # Determine the user instance to operate on.
        user = self.instance 
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        # new_password2 = data.get('new_password2')
        

        # 1. Validate old password
        if not user.check_password(old_password):
            raise serializers.ValidationError({"old_password": "Old password is not correct."})

        # # 2. Validate new passwords match
        # if new_password1 != new_password2:
        #     raise serializers.ValidationError({"error": "New password and confirm password must be the same."})

        # 3. Validate new password against Django's password validators
        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as e:
            # Convert Django's ValidationError to DRF's ValidationError
            raise serializers.ValidationError({"new_password": list(e.messages)})

        # 4. Ensure new password is not the same as the old password
        if user.check_password(new_password):
            raise serializers.ValidationError({"new_password": "New password cannot be the same as the old password."})

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
        new_password = self.validated_data.get('new_password')

        # Set the new password and save the user
        user.set_password(new_password)
        user.save()

        # blacklist all refresh tokens issued to the user
        if self.validated_data.get('logout_from_all_devices'):
            tokens = OutstandingToken.objects.filter(user=user)

            for outstanding_token in tokens:
                token_str = outstanding_token.token  # This is the raw JWT string
                try:
                    token = RefreshToken(token_str)  # Recreate the token object
                    token.blacklist()
                except InvalidToken as e:
                    pass
                except TokenBackendError as e:
                    return Response({'error': str(e)}, status=500)
                except TokenError as e:
                    pass
                except Exception as e:
                    return Response({'error': 'Unexpected error'}, status=500)

        return user

