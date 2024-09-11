from rest_framework import serializers
from .models import *

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id','precio','tipo']

class VehiculoSerializer(serializers.ModelSerializer):
    rel_categoria = CategoriaSerializer()

    class Meta:
        model = Vehiculo
        fields = ['id', 'patente', 'rel_categoria', 'modelo', 'marca', 'anio', 'primera_rto']

class RtoSerializer(serializers.ModelSerializer):
    rel_vehiculo = VehiculoSerializer()
    class Meta:
        model = Rto
        fields = ['id','fecha','resultado','rel_vehiculo']


class FacturaSerializer(serializers.ModelSerializer):

    rel_rto = RtoSerializer()

    class Meta:
        model = Factura
        fields = ['id', 'nro_factura', 'rel_rto','fecha_emision', 'pagado']


    '''
    def get_monto(self, obj:Factura):
        return obj.calcularMonto()
    
    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas')
        factura = Factura.objects.create(**validated_data)
        for linea_data in lineas_data:
            LineaFactura.objects.create(rel_factura=factura, **linea_data)
        return factura

    def update(self, instance, validated_data):
        lineas_data = validated_data.pop('lineas')
        instance.nro_factura = validated_data.get('nro_factura', instance.nro_factura)
        instance.fecha_emision = validated_data.get('fecha_emision', instance.fecha_emision)
        instance.save()

        # Eliminar líneas existentes
        instance.lineas.all().delete()

        # Crear nuevas líneas
        for linea_data in lineas_data:
            LineaFactura.objects.create(rel_factura=instance, **linea_data)

        return instance'''