from .views import BaseHRViewSet
from .serializers import BaseModelSerializer
from django.apps import apps


# importing all custom permissions
import importlib
import inspect
import sys
from rest_framework.permissions import BasePermission
from django.apps import apps
def import_all_permission_classes():
    current_globals = sys.modules[__name__].__dict__

    for config in apps.get_app_configs():
        try:
            permissions_module = importlib.import_module(f"{config.name}.permissions")

            for name, obj in inspect.getmembers(permissions_module, inspect.isclass):
                if issubclass(obj, BasePermission) and obj is not BasePermission:
                    current_globals[name] = obj  # Now this can be used by classname in this module
        except ModuleNotFoundError:
            continue

# Run this once when the module is loaded
import_all_permission_classes()
HR_MODEL_REGISTRY = {
    'users': { # to be used for url making / frontend only
        'model': apps.get_model('accounts', 'customUser') , # to be used to get the queryset and objects
        'permission_classes' : [],
        'filters': ['department', 'role'], # allowed filtes on the model
        # 'fields' : '__all__'  , # list/tuple of fields with view access and create access
        'read_only_fields' : ['id', 'company', 'is_active'], # read only fields 
        'exclude' : ['is_superuser', 'is_staff', 'last_login', 'password', 'user_permissions']
    }
    # Add more models as needed
}

def generate_hr_viewsets():
    viewsets_dict = {}

    for rout_name, config in HR_MODEL_REGISTRY.items():
        model = config['model']
        # fields = config.get('fields', "__all__")
        # serializer = config['serializer']
        filters = config.get('filters', [])
        
        class Meta():
            model = config.get('model', None)

            if "exclude" in config:
                exclude =  config.get('exclude', [])
            else:
                fields = config.get('fields', "__all__")
            read_only_fields = config.get('read_only_fields', [])
            



        serializer_class = type(
            f"{model.__name__}Serializer",
            (BaseModelSerializer,),
            {
                'Meta' : Meta,
                'extra_kwargs' : config.get('extra_kwargs', {})
            }
        )



        viewset_class = type(
            f"{model.__name__}HRViewSet",
            (BaseHRViewSet,),
            {
                'model' : model,
                'permission_classes' : f"{model.__name__}ModelPermission",
                'queryset': model.objects.all(),
                'serializer_class': serializer_class,
                'allowed_filter_fields': filters,
            }
        )

        viewsets_dict[rout_name] = viewset_class

    return viewsets_dict
