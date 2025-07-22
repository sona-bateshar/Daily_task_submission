from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.urls import resolve, reverse, Resolver404
from rest_framework.serializers import Serializer, CharField, EmailField, BooleanField, IntegerField # Import common field types
from rest_framework.fields import empty 





# from .serializers import UserRegisterSerializer, CompanySerializer # Example, import all serializers you might inspect
# from .models import customUser # If your serializers use models directly

# # A mapping from serializer field class names to a more generic type
# FIELD_TYPE_MAP = {
#     'CharField': 'string',
#     'EmailField': 'email',
#     'SlugField': 'string',
#     'URLField': 'url',
#     'IntegerField': 'integer',
#     'FloatField': 'float',
#     'DecimalField': 'decimal',
#     'BooleanField': 'boolean',
#     'DateTimeField': 'datetime',
#     'DateField': 'date',
#     'TimeField': 'time',
#     'UUIDField': 'uuid',
#     'FileField': 'file',
#     'ImageField': 'image',
#     'ChoiceField': 'choice', # You might need special handling for choices
#     'ModelSerializer': 'object', # For nested serializers
#     'ListSerializer': 'array', # For lists of objects/primitives
#     # Add other DRF field types you expect
# }


# # view to send form details to each api endpoint. 
# class ApiFieldDetailsView(APIView):
#     """
#     Returns the expected input fields and their basic validation rules
#     for a specified DRF API view.
#     """
#     permission_classes = [] # Allow anyone to access this for schema info (adjust as needed)

#     def get(self, request, *args, **kwargs):
#         view_name = kwargs.get('view_name') # Get the view name from URL
        
#         if not view_name:
#             return Response(
#                 {"error": "Please provide a view name in the URL."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             # Resolve the view based on its name
#             # We need to resolve the path that corresponds to the view_name
#             # For example, if view_name is 'user_register', we'd need to reverse it to '/api/register/'
#             # This is a bit tricky as reverse needs args/kwargs, so we'll try to find the view class directly
            
#             # A more direct approach to get the view class is to import it if it's always known
#             # or loop through your urlpatterns to find it.
#             # For simplicity, let's assume we know how to map view_name to serializer_class.
#             # In a real app, you might have a dictionary mapping view_name to SerializerClass

#             serializer_map = {
#                 'user_register': UserRegisterSerializer,
#                 'company_list_create': CompanySerializer, # Example for another view
#                 # Add more mappings as your project grows
#             }
            
#             serializer_class = serializer_map.get(view_name)
            
#             if not serializer_class:
#                 return Response(
#                     {"error": f"Serializer not found for view name '{view_name}'. Check serializer_map."},
#                     status=status.HTTP_404_NOT_FOUND
#                 )

#             # Instantiate the serializer (usually without data for schema introspection)
#             serializer_instance = serializer_class()

#             field_details = {}
#             for field_name, field in serializer_instance.fields.items():
#                 rule = {
#                     "type": FIELD_TYPE_MAP.get(field.__class__.__name__, field.__class__.__name__.replace('Field', '').lower()),
#                     "required": field.required,
#                     "read_only": field.read_only,
#                     "write_only": field.write_only,
#                     "label": str(field.label) if field.label else field_name.replace('_', ' ').title(),
#                     "help_text": str(field.help_text) if field.help_text else None,
#                     "default": str(field.default) if field.default is not empty else None,
#                 }

#                 # Add specific field properties
#                 if hasattr(field, 'max_length') and field.max_length is not None:
#                     rule["max_length"] = field.max_length
#                 if hasattr(field, 'min_length') and field.min_length is not None:
#                     rule["min_length"] = field.min_length
#                 if hasattr(field, 'max_value') and field.max_value is not None:
#                     rule["max_value"] = field.max_value
#                 if hasattr(field, 'min_value') and field.min_value is not None:
#                     rule["min_value"] = field.min_value
#                 if hasattr(field, 'choices') and field.choices:
#                     rule["choices"] = [{"value": k, "display_name": v} for k, v in field.choices.items()]
                
#                 # Extract basic validator info (e.g., regex)
#                 field_validators = []
#                 for validator in field.validators:
#                     validator_info = {"name": validator.__class__.__name__}
#                     if hasattr(validator, "regex"):
#                         validator_info["regex"] = validator.regex.pattern
#                     elif hasattr(validator, "min_length"): # For MinimumLengthValidator
#                          validator_info["min_length"] = validator.min_length
#                     # Note: complex validators like UserAttributeSimilarityValidator are hard to expose as simple rules
#                     field_validators.append(validator_info)
#                 if field_validators:
#                     rule["validators"] = field_validators

#                 field_details[field_name] = rule

#             return Response(field_details)

#         except Exception as e: # Catch any other errors
#             return Response(
#                 {"error": f"Could not get details for view '{view_name}': {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )