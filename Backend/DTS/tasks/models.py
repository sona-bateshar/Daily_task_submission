from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import MinValueValidator

from django.utils.timezone import now

from django.db.models.signals import post_save # Used to automatically create TaskProfile
from django.dispatch import receiver # Used with post_save signal

from django.contrib.auth import get_user_model
User = get_user_model()
# The TaskProfile model will hold task-specific user data and methods.
# It links to your existing CustomUser model from the accounts app.
class TaskProfile(models.Model):
    """
    Extends the existing AUTH_USER_MODEL with task-specific fields and methods.
    This uses a OneToOneField to link directly to the User instance.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='task_profile', 
        help_text="The user associated with this task profile."
    )
    
    # preferred_task_view = models.CharField(max_length=50, default='list', blank=True)

    class Meta:
        verbose_name = "Task Profile"
        verbose_name_plural = "Task Profiles"

    def __str__(self):
        return f"{self.user.username}, Task Profile"

    def get_open_tasks(self):
        """
        Returns a QuerySet of all tasks belonging to this user that are not completed.
        This leverages the 'related_name="tasks"' on the Task model's ForeignKey.
        """
        # Access the tasks through the user instance linked to this profile
        return self.user.tasks.filter(is_completed=False)

    def get_completed_tasks(self):
        """
        Returns a QuerySet of all tasks belonging to this user that are completed.
        """
        return self.user.tasks.filter(is_completed=True)

# Signal to automatically create a TaskProfile whenever a new user is created.
@receiver(post_save, sender=User)
def create_or_update_user_task_profile(sender, instance, created, **kwargs):
    """
    Creates a TaskProfile for a new user, or saves an existing one.
    This ensures every user has an associated TaskProfile.
    """
    if created:
        TaskProfile.objects.create(user=instance)
    instance.task_profile.save()

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=10000, blank=True)

    actions_required = models.JSONField(default=list, blank=True)
    
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_tasks'
    )
    
    assignees = models.ManyToManyField(
        User,
        related_name='assigned_tasks',
        blank=True
    )
    
    supporting_staff = models.ManyToManyField(
        User,
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
    due_date = models.DateField(validators=[MinValueValidator(limit_value=now)])
    closed_at = models.DateTimeField(null=True, blank=True)
    discarted = models.BooleanField(default=False)

    def clean(self):
        
        # Prevent edits if task is closed
        if self.pk:  # if task already exists
            original = Task.objects.get(pk=self.pk)
            if original.status == 'closed':
                raise ValidationError('Cannot edit a closed task.')

    def save(self, *args, **kwargs):
        # Automatically set closed_at when status changes to closed
        if self.status == 'closed' and not self.closed_at:
            self.closed_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.status})"


class Review(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    reviewer = models.ForeignKey(
        User,
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
        return f"Review for {self.task.title} by {self.reviewer.name}"
    
class TaskUpdates(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='task_updates'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='task_updates'
    )

    description = models.TextField(max_length=10000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Only owener or assignee or supporting staff can give updates.
        if self.user != self.task.owner and self.user != self.task.assignees and self.user != self.task.supporting_staff:
            raise ValidationError("Reviewer must be the task owner or assignee or supporting staff can give updates.")

    def save(self, *args, **kwargs):
        self.full_clean()  # trigger the validation
        super().save(*args, **kwargs)

    def __str__(self):
        return f"update for {self.task.title} by {self.user.name}"




                  
