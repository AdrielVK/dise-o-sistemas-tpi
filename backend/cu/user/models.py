from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserAccountManager(BaseUserManager):
    
    def create_user(self, username, role, password=None, **extra_fields):
        if not username:
            raise ValueError("El usuario debe tener un nombre de usuario")

        user = self.model(username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, role, password, **extra_fields):
        user = self.create_user(username, role, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser, PermissionsMixin):
    roles = (
        ('gerente', 'Gerente'),
        ('mecanico', 'Mecanico'),
        ('atencion', 'Atencion')
    )

    username = models.CharField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserAccountManager()
    role = models.CharField(choices=roles, default='atencion', max_length=40)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['role']

    def __str__(self):
        return self.username
