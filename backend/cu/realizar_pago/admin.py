from django.contrib import admin
from .models import *


class RtoAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha','nombre_mecanico','resultado','rel_vehiculo')

admin.site.register(Categoria)
admin.site.register(Factura)
admin.site.register(Rto)
admin.site.register(Vehiculo)
admin.site.register(Tarjeta)
