from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import MinValueValidator

from django.utils.timezone import now
from datetime import date
from django.db.models.signals import post_save # Used to automatically create TaskProfile
from django.dispatch import receiver # Used with post_save signal

from django.contrib.auth import get_user_model
User = get_user_model()



class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=10000, blank=True)

    actions_required = models.JSONField(default=list, blank=True)
    
    owner = models.ForeignKey(
        'company.CompanyProfile', 
        on_delete=models.CASCADE,
        related_name='owned_tasks'
    )
    
    assignees = models.ManyToManyField(
        'company.CompanyProfile', 
        related_name='assigned_tasks',
        blank=True
    )
    
    supporting_staff = models.ManyToManyField(
        'company.CompanyProfile', 
        related_name='support_tasks',
        blank=True
    )

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='open'
    )

    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateField(validators=[MinValueValidator(limit_value=date.today())])
    closed_at = models.DateTimeField(null=True, blank=True)
    discarted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Automatically set closed_at when status changes to closed
        if self.status == 'closed' and not self.closed_at:
            self.closed_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}"


class Review(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    reviewer = models.ForeignKey(
        'company.CompanyProfile', 
        on_delete=models.CASCADE,
        related_name='given_reviews'
    )

    RATING_CHOICES = [
        ('bad', 'Bad'),
        ('avg', 'Average'),
        ('good', 'Good'),
    ]
    rating = models.CharField(
        max_length=10,
        choices=RATING_CHOICES
    )

    description = models.TextField(max_length=10000, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Only owner or their parent can be reviewer
        if self.reviewer != self.task.owner and self.reviewer != self.task.owner.parent:
            raise ValidationError("Reviewer must be the task owner or their manager.")

    def save(self, *args, **kwargs):
        self.full_clean()  # trigger the validation
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review for {self.task.title} by {self.reviewer}"
    
class Comment(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='task_comments',
        null=False,
        blank=False
    )

    user = models.ForeignKey(
        'company.CompanyProfile', 
        on_delete=models.CASCADE,
        related_name='task_comments',
        null=False,
        blank=False
    )

    description = models.TextField(max_length=10000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Only owner or assignee or supporting staff can give updates.
        if (self.user != self.task.owner and 
            self.user not in self.task.assignees.all() and 
            self.user not in self.task.supporting_staff.all()):
            raise ValidationError("Comment can only be given by the task owner, assignee, or supporting staff")
    
    def save(self, *args, **kwargs):
        self.full_clean()  # trigger the validation
        super().save(*args, **kwargs)

    def __str__(self):
        return f"comment for {self.task} by {self.user}"


