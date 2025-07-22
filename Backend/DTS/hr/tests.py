from django.test import TestCase
# myapp/tests.py (or wherever your app's tests are located)

from django.test import TestCase
from django.db import models
from rest_framework import serializers

# # --- 1. Define your Django Model (as used in previous examples) ---
# # This model needs to be part of a Django app and migrated for tests to run properly.
# class Product(models.Model):
#     name = models.CharField(max_length=100)
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     in_stock = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True) # Added for testing exclude

#     class Meta:
#         app_label = 'myapp' # IMPORTANT: Replace 'myapp' with your actual Django app name
#         verbose_name = "Product"
#         ordering = ['id'] # Ensure consistent ordering for tests

#     def __str__(self):
#         return self.name

# # --- 2. Define your BaseModelSerializer (as used in previous examples) ---
# class BaseModelSerializer(serializers.ModelSerializer):
#     pass

# # --- 3. Define your Dynamic Serializer Creation Function (as used in previous examples) ---
# def create_dynamic_serializer(model_class, fields_to_include, read_only_fields=None, exclude_fields=None, extra_kwargs=None):
#     """
#     Dynamically creates a Django REST Framework ModelSerializer.
#     """
#     # Define the attributes for the inner 'Meta' class
#     meta_attributes = {
#         'model': model_class,
#         'fields': fields_to_include,
#         'read_only_fields': read_only_fields if read_only_fields is not None else [],
#         'exclude': exclude_fields if exclude_fields is not None else [],
#         'extra_kwargs': extra_kwargs if extra_kwargs is not None else {},
#     }
#     DynamicMeta = type('Meta', (object,), meta_attributes)

#     # Define the attributes for the new Serializer class
#     serializer_attributes = {
#         'Meta': DynamicMeta,
#     }
#     serializer_name = f"{model_class.__name__}DynamicSerializer" # Naming for clarity in tests
#     DynamicSerializer = type(serializer_name, (BaseModelSerializer,), serializer_attributes)

#     return DynamicSerializer

# --- 4. Write the Test Cases ---

class DynamicSerializerTests(TestCase):
    """
    Tests for the dynamically created ModelSerializer classes.
    """

    def setUp(self):
        """
        Set up some initial Product instances for testing.
        """
        self.product1 = Product.objects.create(name="Laptop", price=1200.00, in_stock=True)
        self.product2 = Product.objects.create(name="Mouse", price=25.50, in_stock=False)

    def test_01_all_fields_serializer_serialization(self):
        """
        Test serialization with '__all__' fields.
        """
        # Dynamically create the serializer
        AllFieldsSerializer = create_dynamic_serializer(Product, '__all__')
        serializer = AllFieldsSerializer(instance=self.product1)

        # Expected data (note: 'id' and 'created_at' will be included by default with __all__)
        expected_data = {
            'id': self.product1.id,
            'name': 'Laptop',
            'price': '1200.00', # DecimalField serializes to string by default
            'in_stock': True,
            'created_at': serializer.data['created_at'] # created_at is auto_now_add, so we get it from serialized data
        }
        self.assertEqual(serializer.data, expected_data)

    def test_02_specific_fields_serializer_serialization(self):
        """
        Test serialization with a list of specific fields.
        """
        # Dynamically create the serializer to include only 'name' and 'price'
        LimitedFieldsSerializer = create_dynamic_serializer(Product, ['name', 'price'])
        serializer = LimitedFieldsSerializer(instance=self.product2)

        expected_data = {
            'name': 'Mouse',
            'price': '25.50'
        }
        self.assertEqual(serializer.data, expected_data)

    def test_03_exclude_fields_serializer_serialization(self):
        """
        Test serialization with 'exclude' option.
        """
        # Dynamically create the serializer to exclude 'created_at'
        ExcludeCreatedAtSerializer = create_dynamic_serializer(Product, '__all__', exclude_fields=['created_at'])
        serializer = ExcludeCreatedAtSerializer(instance=self.product1)

        # Expected data should not contain 'created_at'
        self.assertNotIn('created_at', serializer.data)
        self.assertIn('name', serializer.data)
        self.assertIn('price', serializer.data)
        self.assertIn('in_stock', serializer.data)
        self.assertIn('id', serializer.data)


    def test_04_read_only_fields_serialization(self):
        """
        Test that read_only_fields are included in output.
        """
        # Make 'name' read-only
        ReadOnlyNameSerializer = create_dynamic_serializer(Product, ['name', 'price'], read_only_fields=['name'])
        serializer = ReadOnlyNameSerializer(instance=self.product1)

        self.assertIn('name', serializer.data)
        self.assertEqual(serializer.data['name'], 'Laptop')

    def test_05_read_only_fields_deserialization_create(self):
        """
        Test that read_only_fields are ignored on create.
        """
        ReadOnlyNameSerializer = create_dynamic_serializer(Product, ['name', 'price'], read_only_fields=['name'])
        
        # Attempt to create a new product, providing 'name' (which is read-only)
        data = {'name': 'New ReadOnly Product', 'price': '99.99'}
        serializer = ReadOnlyNameSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors) # Should be valid even with read-only field

        # Check if 'name' was actually set from input (it shouldn't be)
        # DRF ignores read_only_fields on input, so 'name' will not be in validated_data
        self.assertNotIn('name', serializer.validated_data)
        self.assertIn('price', serializer.validated_data)

        # Save the instance and verify
        new_product = serializer.save()
        self.assertEqual(new_product.price, 99.99)
        # 'name' will be empty or default if not provided and not required, 
        # or it will use the model's default/null if allowed.
        # For CharField, it usually defaults to empty string if blank=True, or raises error if required.
        # Here, since name is required by model, and not provided in validated_data, it would fail if not for
        # a mock or if the model allows blank. Let's assume the model allows blank for simplicity here.
        # In a real scenario, you'd ensure the model allows blank or provide a non-read-only field for name.
        # For this test, we verify that the *input* 'name' was ignored.
        
        # To make this test more robust for 'name', we should ensure the model allows blank=True or null=True
        # or provide a non-read-only field for 'name' in the serializer.
        # For now, we confirm it's not in validated_data.
        
        # Let's create a new serializer that makes 'name' NOT read-only for a create test
        WritableNameSerializer = create_dynamic_serializer(Product, ['name', 'price'])
        data_writable = {'name': 'Writable Product', 'price': '150.00'}
        serializer_writable = WritableNameSerializer(data=data_writable)
        self.assertTrue(serializer_writable.is_valid(), serializer_writable.errors)
        created_product = serializer_writable.save()
        self.assertEqual(created_product.name, 'Writable Product')
        self.assertEqual(created_product.price, 150.00)


    def test_06_read_only_fields_deserialization_update(self):
        """
        Test that read_only_fields are ignored on update.
        """
        ReadOnlyNameSerializer = create_dynamic_serializer(Product, ['name', 'price'], read_only_fields=['name'])
        
        # Attempt to update product1, changing 'name' (which is read-only)
        data = {'name': 'Updated Laptop Name', 'price': '1300.00'}
        serializer = ReadOnlyNameSerializer(instance=self.product1, data=data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # 'name' should not be in validated_data for update, as it's read-only
        self.assertNotIn('name', serializer.validated_data)
        self.assertIn('price', serializer.validated_data)

        updated_product = serializer.save()
        # Verify that the 'name' from input was ignored, and the original name persists
        self.assertEqual(updated_product.name, 'Laptop')
        self.assertEqual(updated_product.price, 1300.00)

    def test_07_extra_kwargs_required_false(self):
        """
        Test extra_kwargs to make a field not required.
        """
        # Make 'name' not required
        OptionalNameSerializer = create_dynamic_serializer(
            Product, 
            ['name', 'price'], 
            extra_kwargs={'name': {'required': False}}
        )

        # Attempt to create a product without providing 'name'
        data = {'price': '500.00'}
        serializer = OptionalNameSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        
        new_product = serializer.save()
        self.assertEqual(new_product.price, 500.00)
        # 'name' should be an empty string if CharField and blank=True, or None if null=True
        # For our example Product model, CharField is not blank=True by default, so it might
        # default to an empty string if the model allows it.
        # This test primarily ensures validation passes when 'name' is omitted.
        self.assertEqual(new_product.name, '') # Assuming CharField defaults to '' or allows blank

    def test_08_deserialization_create(self):
        """
        Test full deserialization to create a new instance.
        """
        AllFieldsSerializer = create_dynamic_serializer(Product, '__all__')
        
        data = {
            'name': 'New Product From Data',
            'price': '75.25',
            'in_stock': True
        }
        serializer = AllFieldsSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        
        new_product = serializer.save()
        self.assertIsInstance(new_product, Product)
        self.assertEqual(new_product.name, 'New Product From Data')
        self.assertEqual(new_product.price, 75.25)
        self.assertEqual(new_product.in_stock, True)
        self.assertIsNotNone(new_product.id)
        self.assertIsNotNone(new_product.created_at)

    def test_09_deserialization_update(self):
        """
        Test full deserialization to update an existing instance.
        """
        AllFieldsSerializer = create_dynamic_serializer(Product, '__all__')
        
        data = {
            'name': 'Updated Laptop Name',
            'price': '1500.00',
            'in_stock': False
        }
        serializer = AllFieldsSerializer(instance=self.product1, data=data, partial=False) # Full update
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_product = serializer.save()
        self.assertEqual(updated_product.id, self.product1.id)
        self.assertEqual(updated_product.name, 'Updated Laptop Name')
        self.assertEqual(updated_product.price, 1500.00)
        self.assertEqual(updated_product.in_stock, False)
        # created_at should remain unchanged on update
        self.assertEqual(updated_product.created_at, self.product1.created_at)

    def test_10_deserialization_partial_update(self):
        """
        Test partial deserialization to update an existing instance.
        """
        AllFieldsSerializer = create_dynamic_serializer(Product, '__all__')
        
        # Only update price
        data = {
            'price': '30.00'
        }
        serializer = AllFieldsSerializer(instance=self.product2, data=data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_product = serializer.save()
        self.assertEqual(updated_product.id, self.product2.id)
        self.assertEqual(updated_product.name, 'Mouse') # Name should not change
        self.assertEqual(updated_product.price, 30.00)
        self.assertEqual(updated_product.in_stock, False) # In_stock should not change

    def test_11_invalid_data_create(self):
        """
        Test handling of invalid data during creation.
        """
        AllFieldsSerializer = create_dynamic_serializer(Product, '__all__')
        
        # Missing required 'name' field (assuming name is required by model)
        data = {
            'price': '10.00',
            'in_stock': True
        }
        serializer = AllFieldsSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors) # 'name' should be reported as missing
        
        # Invalid data type for price
        data_invalid_price = {
            'name': 'Invalid Price Product',
            'price': 'not-a-number',
            'in_stock': True
        }
        serializer_invalid_price = AllFieldsSerializer(data=data_invalid_price)
        self.assertFalse(serializer_invalid_price.is_valid())
        self.assertIn('price', serializer_invalid_price.errors)

    def test_12_dynamic_serializer_name(self):
        """
        Test that the dynamically created serializer has the correct name.
        """
        TestModelSerializer = create_dynamic_serializer(Product, '__all__')
        self.assertEqual(TestModelSerializer.__name__, 'ProductDynamicSerializer')



# Create your tests here.
