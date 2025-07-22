from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class UppercaseValidator:
    def validate(self, password, user=None):
        if not any(char.isupper() for char in password):
            raise ValidationError(
                _("Your password must contain at least one uppercase letter."),
                code='password_no_uppercase',
            )

    def get_help_text(self):
        return _("Your password must contain at least one uppercase letter.")

class LowercaseValidator:
    def validate(self, password, user=None):
        if not any(char.islower() for char in password):
            raise ValidationError(
                _("Your password must contain at least one lowercase letter."),
                code='password_no_lowercase',
            )

    def get_help_text(self):
        return _("Your password must contain at least one lowercase letter.")

class NumberValidator:
    def validate(self, password, user=None):
        if not any(char.isdigit() for char in password):
            raise ValidationError(
                _("Your password must contain at least one digit."),
                code='password_no_digit',
            )

    def get_help_text(self):
        return _("Your password must contain at least one digit.")

class SymbolValidator:
    def validate(self, password, user=None):
        # A simple check for common symbols. You might want to refine this regex.
        if not any(not char.isalnum() for char in password): # isalnum() checks if char is alphanumeric
            raise ValidationError(
                _("Your password must contain at least one special character."),
                code='password_no_symbol',
            )

    def get_help_text(self):
        return _("Your password must contain at least one special character.")