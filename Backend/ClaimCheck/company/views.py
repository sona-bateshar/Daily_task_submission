from gc import get_objects
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import CompanyProfileModelPermission
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

class BaseHRViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        """
        Filters the queryset for list views to only show objects the user has object-level permission to view at 
        """
        queryset = super().get_queryset()

        request = self.request
        allowed_ids = set()
        for obj in queryset:
            try:
                self.check_object_permissions(request, obj)
                allowed_ids.add(obj.pk)
            except PermissionDenied:
                continue
        queryset = queryset.filter(pk__in=allowed_ids)

    #     query_params = self.request.query_params
    #     orderby = query_params['order']
    #     filter = query_params['filter']
    #     search = query_params['search']
    #     page = query_params['page']
        return queryset
    
    def get_object(self):
        """
        Retrieve a single object for retrieve, update, destroy actions.
        This method is designed to first find the object, then apply object permissions.
        """
        # 1. Get the primary key from the URL
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        pk = self.kwargs[lookup_url_kwarg]
        obj = get_object_or_404(super().get_queryset(), **{self.lookup_field: pk})

        # 3. Check object-level permissions using DRF's built-in mechanism.
        # This calls has_object_permission() from your UserPermission.
        # If permission is denied, it will raise PermissionDenied (403).
        self.check_object_permissions(self.request, obj)

        return obj

import random
import string
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings # To access email settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Get the currently active User model (can be django.contrib.auth.models.User or a custom user model)
User = get_user_model()

class AdminPasswordResetView(APIView):
    """
    API endpoint for administrators to reset another user's password.
    Requires authentication and admin privileges.

    it generates a new random password,
    updates the user's password in the database (hashed),
    and then emails the new password to the user.
    """
    permission_classes = [IsAuthenticated, CompanyProfileModelPermission]
    
    def post(self, request, pk,  *args, **kwargs):
        """
        Handles the POST request to reset a user's password.
        The 'pk' in the URL refers to the ID of the user whose password is being reset.
        """
        try:
            # 1. Retrieve the target user based on the 'pk' from the URL
            target_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            # If the user with the given PK does not exist
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # check if the user is from their company or not. 
        self.check_object_permissions(request, target_user)


        # 1. Generate a new random password
        new_password = self.generate_random_password()
        print(f"DEBUG: Generated new password for {target_user}: {new_password}")

        # 2. Set the new password for the user in the database
        # Django's set_password automatically hashes the password before saving.
        target_user.set_password(new_password)
        target_user.save()
        print(f"DEBUG: Password for {target_user} updated in DB.")

        # 3. Email the newly generated password to the user
        email_subject = "Your New Password for Our Service"
        email_body = (
            f"Dear {target_user},\n\n" # Use username if available, otherwise email
            f"Your password for our service has been successfully reset.\n"
            f"Your new temporary password is: {new_password}\n\n"
            f"For security reasons, we highly recommend that you log in and change this password immediately.\n\n"
            f"If you did not request this password reset, please contact our support team immediately.\n\n"
            f"Sincerely,\n"
            f"Your Service Team"
        )

        try:
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL, # Defined in your Django settings.py
                recipient_list=[target_user.email],
                fail_silently=False, # Set to True to suppress exceptions
            )
            print(f"DEBUG: Email sent to {target_user.email} successfully.")
            return Response(
                {"message": "A new password has been sent to user's registred email"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            # Log the error for debugging. In a real app, you might want to revert the password change
            # or have an admin notified.
            print(f"ERROR: Failed to send email to {target_user.email}: {e}")
            return Response(
                {"message": "Password updated, but failed to send email. Please contact support."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def generate_random_password(self):
        """
        Generates a random password adhering to the following validation rules:
        - Minimum length of 8 characters.
        - Contains at least one uppercase letter.
        - Contains at least one lowercase letter.
        - Contains at least one digit.
        - Contains at least one special character (non-alphanumeric).

        Args:
            length (int): The desired length of the password. Defaults to 8.
                        If the specified length is less than 4 (to ensure at least
                        one of each required character type), it will default to 8.

        Returns:
            str: A randomly generated password.
        """

        # Define character sets
        uppercase_chars = string.ascii_uppercase
        lowercase_chars = string.ascii_lowercase
        digit_chars = string.digits
        symbol_chars = string.punctuation # Includes common special characters

        # Combine all character sets for general random selection
        all_chars = uppercase_chars + lowercase_chars + digit_chars + symbol_chars

        # Initialize password with at least one of each required character type
        password_chars = [
            random.choice(uppercase_chars),
            random.choice(lowercase_chars),
            random.choice(digit_chars),
            random.choice(symbol_chars)
        ]

        length = random.choice([i for i in range(8, 20)])
        # Fill the rest of the password length with random characters from all sets
        for _ in range(length - len(password_chars)):
            password_chars.append(random.choice(all_chars))

        # Shuffle the list to randomize the positions of the required characters
        random.shuffle(password_chars)

        # Join the characters to form the final password string
        return "".join(password_chars)



from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from .models import CompanyProfile # assuming your model is here

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.all()
    # serializer_class = EmployeeSerializer

    @action(detail=False, methods=['get'])
    def latest_nomination_choices(self, request):
        """
        Endpoint for getting choices for creating a new Employee.
        Accessible at /api/employees/latest_nomination_choices/
        """
        # Logic to get choices for the current user
        user = request.user
        nominations = ...  # e.g., Nomination.objects.filter(nominated_by=user)
        choices = [{'id': nom.id, 'name': nom.full_name} for nom in nominations]
        return Response(choices)

    @action(detail=True, methods=['get'])
    def nomination_choices(self, request, pk=None):
        """
        Endpoint for getting choices for editing a specific Employee.
        Accessible at /api/employees/<id>/nomination_choices/
        """
        try:
            employee = self.get_object() # get_object() uses the pk from the URL
        except Http404:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # Logic to get choices, potentially based on the employee instance
        # e.g., choices could include the employee's current nomination plus other valid options
        current_nomination = employee.latest_nomination
        
        # Example logic: get all nominations plus the employee's current one
        nominations = ... # e.g., Nomination.objects.filter(...)
        
        # Make sure the current one is always in the list if it's not already
        choices = [{'id': nom.id, 'name': nom.full_name} for nom in nominations]
        if current_nomination and not any(choice['id'] == current_nomination.id for choice in choices):
            choices.append({'id': current_nomination.id, 'name': current_nomination.full_name})
            
        return Response(choices)

