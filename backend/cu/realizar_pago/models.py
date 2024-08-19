from django.db import models
from django.core.exceptions import ValidationError


class Vehiculo(models.Model):

    categorias = (
        ("l", "menos de 4 ruedas"),
        ("m", "4 ruedas o mas, menos de 1 tonelada, pasajeros"),
        ("n", "4 ruedas o mas, menos de 1 tonelada, carga"),
        ("o", "acoplados")
    )
    patente = models.CharField(max_length=7, null=False, blank=False, unique=True)
    categoria = models.CharField(max_length=2, choices=categorias, default="m")
    modelo = models.CharField(max_length=50)
    marca = models.CharField(max_length=50)
    anio = models.IntegerField()
    primera_rto = models.BooleanField(default=True)

    def __str__(self):
        return f'vehiculo {self.patente}'
    
    


class Rto(models.Model):
    resultados = (
        ("aceptado", "Aceptado"),
        ("rechazado", "Rechazado"),
        ("condicional", "Condicional")
    )

    descripcion = models.CharField(max_length=255)
    nombre_mecanico = models.CharField(max_length=255)
    resultado = models.CharField(choices=resultados, default="rechazado", max_length=15)
    rel_vehiculo = models.OneToOneField(Vehiculo, on_delete=models.CASCADE, blank=False)

    def __str__(self):
        return f'rto: {self.resultado}'
    

class Factura(models.Model):
    nro_factura = models.IntegerField(unique=True)
    fecha_emision = models.DateField()
    rel_rto = models.OneToOneField(Rto, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f'factura nro {self.nro_factura}'
    
    def calcularMonto(self):
        lineas = self.lineas.all()
        total = sum(linea.monto for linea in lineas)
        return total
    
    def agregarLineaFactura(self, descripcion, monto):
        LineaFactura.objects.create(rel_factura = self, descripcion = descripcion, monto = monto) 
    
class LineaFactura(models.Model):
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=255)
    rel_factura =models.ForeignKey(Factura, on_delete=models.CASCADE, related_name='lineas', blank=False)

    def __str__(self):
        return f'{self.descripcion[:10]}...'
    





    '''SIMULA AL BANCO'''
def validar_rango(valor):
    if not (10**13 <= valor < 10**17):
        raise ValidationError('El número debe tener entre 14 y 16 cifras.')
    
class Tarjeta(models.Model):
    saldo = models.DecimalField(max_digits=12, decimal_places=2)
    nro = models.BigIntegerField(validators=[validar_rango])
    cod_seguridad = models.IntegerField()
    fecha_vencimiento = models.DateField()

    def __str__(self):
        return f'{self.nro}'
    