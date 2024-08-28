from django.db import models
from django.shortcuts import get_object_or_404
from django_extensions.db.fields import AutoSlugField
from decimal import Decimal


class Categoria(models.Model):
    precio = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    tipo = models.CharField(max_length=2 ,null=False, blank=False)


class Vehiculo(models.Model):
    
    patente = models.CharField(max_length=7, null=False, blank=False, unique=True)
    modelo = models.CharField(max_length=50)
    marca = models.CharField(max_length=50)
    anio = models.IntegerField()
    primera_rto = models.BooleanField(default=True)
    
    rel_categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='cat')
    #rel_factura = models.ForeignKey(Factura, on_delete=models.SET_NULL, blank=True, null=True, related_name='rel-rto')

    def __str__(self):
        return f'vehiculo {self.patente}'

class Rto(models.Model):
    
    resultados = (
        ("aceptado", "Aceptado"),
        ("rechazado", "Rechazado"),
        ("condicional", "Condicional")
    )

    fecha = models.DateField()
    nombre_mecanico = models.CharField(max_length=255)  
    resultado = models.CharField(choices=resultados, default="rechazado", max_length=15)
    
    rel_vehiculo = models.OneToOneField(Vehiculo, on_delete=models.CASCADE, blank=False)

    def __str__(self):
        return f'rto: {self.resultado}'
    
    @staticmethod
    def getUltimaRto( vel:Vehiculo):
        return Rto.objects.get(rel_vehiculo=vel)



class Factura(models.Model):

    nro_factura = AutoSlugField(populate_from='id', unique=True, max_length=10)
    fecha_emision = models.DateField(auto_now_add=True)
    pagado = models.BooleanField(default=False)

    rel_rto = models.ForeignKey(Rto, on_delete=models.SET_NULL, blank=True, null=True, related_name='rto')
    #rel_categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='rel-categoria')
    
    def __str__(self):
        return f'factura nro {self.nro_factura}'
    
    def calcularMonto(self, precio, anio:int, pri_rto:bool):
        if not pri_rto:
            if anio > 2010:
                return precio
            else:
                return precio * Decimal('1.1')
        else:
            if anio > 2010:
                return precio * Decimal('1.05')
            else:
                return precio * Decimal('1.15') 


  
class Tarjeta(models.Model):
    saldo = models.DecimalField(max_digits=12, decimal_places=2)
    nro = models.IntegerField()
    cod_seguridad = models.IntegerField()
    fecha_vencimiento = models.DateField()

    def __str__(self):
        return f'{self.nro}'
    