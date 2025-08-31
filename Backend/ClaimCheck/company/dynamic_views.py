from .views import BaseModelViewSet
from .serializers import BaseModelSerializer
from django.apps import apps

from rest_framework import serializers

# importing all custom permissions
import importlib
import inspect
import sys
from rest_framework.permissions import BasePermission, IsAuthenticated
from django.apps import apps

from django.contrib.auth import get_user_model
User = get_user_model()

def import_all_permission_classes():
    current_globals = sys.modules[__name__].__dict__
    permissions = []
    for config in apps.get_app_configs():
        try:
            permissions_module = importlib.import_module(f"{config.name}.permissions")

            for name, obj in inspect.getmembers(permissions_module, inspect.isclass):
                if issubclass(obj, BasePermission) and obj is not BasePermission:
                    current_globals[name] = obj  # Now this can be used by classname in this module
                    permissions.append(obj)
        except ModuleNotFoundError:
            continue
    return permissions
    

# Run this once when the module is loaded
permissions = import_all_permission_classes()

MODEL_REGISTRY = {
    'company-profile': { 
        'model' : apps.get_model('company', 'CompanyProfile') 
        , 'filters': ['department', 'role'] 
        , 'read_only_fields' : ['id', 'company']
    }


    , 'company':{
        'model' : apps.get_model('company', 'company') 
        , 'read_only_fields' : ['id']
        , 'exclude' : ['is_active']
    }

    , 'branch':{
        'model' : apps.get_model('company', 'Branch')
        , 'read_only_fields' : ['id', 'company']
    }

    , 'department':{
        'model' : apps.get_model('company', 'Department') 
        ,'read_only_fields' : ['id', 'company']
    }

    , 'role':{
        'model' : apps.get_model('company', 'Role') 
        , 'read_only_fields' : ['id', 'company']
    }

    , 'user': { # to be used for url making / frontend only
        'model' : User
        , 'permission_classes' : []
        , 'filters': [] 
        # , 'fields' : '__all__'  
        , 'read_only_fields' : ['id', 'company', 'is_active']
        , 'exclude' : ['is_superuser', 'is_staff', 'last_login', 'password', 'user_permissions']
    }
    # Add more models as needed
}

def generate_viewsets():
    viewsets_dict = {}
    serializers_dict = {}
    # Store the created serializer in the dictionary
    

    for rout_name, config in MODEL_REGISTRY.items():
        model = config['model']
        read_only_fields = config.get('read_only_fields', [])
        exclude = config.get('exclude', [])
        filters = config.get('filters', [])
        # Build the Meta class
        permission_classes = [IsAuthenticated]
        model_permission = globals().get(f"{model.__name__}ModelPermission", None)

        if model_permission:
            permission_classes.append(model_permission)
        
        serializer_meta_attrs = {
            'model': model,
            'read_only_fields': read_only_fields
        }
        if exclude:
            serializer_meta_attrs['exclude'] = exclude
        else:
            serializer_meta_attrs['fields'] = config.get('fields', "__all__")
        
        DynamicMeta = type('Meta', (), serializer_meta_attrs)
        
        # Build the initial serializer attributes
        serializer_attrs = {
            'Meta': DynamicMeta,
            'extra_kwargs': config.get('extra_kwargs', {})
        }
        
        # --- SPECIAL CASE FOR USERS ---
        if rout_name == 'user' and 'company-profile' in serializers_dict :
            company_profile_serializer = serializers_dict.get('company-profile', None)
            serializer_attrs['company_profile_details'] = company_profile_serializer(
                source='users_company_profile',
                read_only=True
            )
        
        serializer_class = type(
            f"{model.__name__}Serializer",
            (BaseModelSerializer,), 
            serializer_attrs
        )
        serializers_dict[rout_name] = serializer_class

        viewset_class = type(
            f"{model.__name__}HRViewSet",
            (BaseModelViewSet,),
            {
                'model' : model,
                'permission_classes' : permission_classes,
                'queryset': model.objects.all(),
                'serializer_class': serializer_class,
                'allowed_filter_fields': filters,
            }
        )

        viewsets_dict[rout_name] = viewset_class
    return viewsets_dict





