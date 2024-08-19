from django.contrib import admin

from django.contrib import admin
from . import models

@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'is_staff')
    search_fields = ('username', 'is_staff')