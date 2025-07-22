from django.db import models
# from accounts.models import customUser

class Company(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False, db_index=True)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True, unique=True)
    is_active = models.BooleanField(default=True, help_text="Indicates whether the company is active or not.")
    head = models.OneToOneField(
        'accounts.customUser', 
        on_delete=models.SET_NULL,
        blank=True, 
        null=True,
        related_name='headed_companies'  
    )

    class Meta:
        verbose_name_plural = "Companies" 

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        users = self.users.all()
        for user in users:
            user.is_active = self.is_active and user.is_user_active
            user.save()
        super().save(*args, **kwargs) 


class Branch(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    head = models.OneToOneField(
        'accounts.customUser', 
        on_delete=models.SET_NULL,
        blank=True, 
        null=True,
        related_name='headed_branches'  
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,               
        related_name='branches',
        editable=False   
    )

    class Meta:
        verbose_name_plural = "Branches" # Correct pluralization for admin

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    
    head = models.OneToOneField(
        'accounts.customUser', 
        on_delete=models.SET_NULL,
        blank=True, 
        null=True,
        related_name='headed_departments'

    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,               
        related_name='departments'  ,
        editable=False      
    )

    def __str__(self):
        return self.name


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,               
        related_name='roles' ,
        editable=False       
    )

    def __str__(self):
        return self.name