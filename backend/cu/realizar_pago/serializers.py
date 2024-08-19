from rest_framework import serializers
from .models import *

class VehiculoSerializer(serializers.ModelSerializer):
    categoria_descripcion = serializers.SerializerMethodField()

    class Meta:
        model = Vehiculo
        fields = ['patente', 'categoria', 'categoria_descripcion', 'modelo', 'marca', 'anio', 'primera_rto']

    def get_categoria_descripcion(self, obj):
        return dict(Vehiculo.categorias).get(obj.categoria, obj.categoria)

class RtoSerializer(serializers.ModelSerializer):
    rel_vehiculo = VehiculoSerializer()
    class Meta:
        model = Rto
        fields = ['descripcion','nombre_mecanico','resultado','rel_vehiculo']

class LineaFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineaFactura
        fields = ['monto','descripcion']

class FacturaSerializer(serializers.ModelSerializer):
    lineas = LineaFacturaSerializer(many=True)
    monto = serializers.SerializerMethodField()

    class Meta:
        model = Factura
        fields = ['nro_factura','fecha_emision', 'lineas', 'monto']

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

        return instance