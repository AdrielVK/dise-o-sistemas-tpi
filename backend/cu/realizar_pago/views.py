from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import *
from rest_framework.permissions import IsAuthenticated
from ..user.permissions import IsAtencion, IsAdmin
from .serializers import *
from rest_framework.response import Response
from rest_framework import status, permissions

from django.http import HttpResponse
from rest_framework.views import APIView

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import timezone
from datetime import datetime


class UI(viewsets.ViewSet):
    permission_classes = [IsAtencion]
    @action(detail=False, methods=['get'], url_path='mostrar-opciones')
    def mostrarOpciones(self, request):
        return Response({"opciones": ["Facturacion", "Administracion", "Otro"]}, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'], url_path='mostrar-rto')
    def mostrarRto(self, request):
        try:
            patente = request.query_params.get('patente')
            vehiculo = Taller.getVehiculo(patente)

            rto = Rto.getUltimaRto(vel=vehiculo)

            rto_serialized = RtoSerializer(rto)
            vel_serialized = VehiculoSerializer(vehiculo)

            return Response({"rto": rto_serialized.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['get'], url_path='mostrar-monto')
    def mostrarMonto(self, request):
        id_rto = request.query_params.get('id_rto')
        rto = Rto.objects.get(id=id_rto)
        
        factura = Taller.generarFactura(rto)
        
        vehiculo = rto.rel_vehiculo
        precio_categoria = vehiculo.rel_categoria.precio
        factura_serialized = FacturaSerializer(factura)
        monto = factura.calcularMonto(precio_categoria, vehiculo.anio, vehiculo.primera_rto)

        return Response({"monto": monto, "factura":factura_serialized.data}, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'], url_path='mostrar-mp')
    def mostrarMP(self, request):
        mp = Taller.mostrarMetodosDePago()
        return Response({"metodos": mp}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='pagar')
    def pagar(self,request):
        pago = Taller.realizar_pago(request)

        if pago:
            return Response({"Pago exitoso"}, status=status.HTTP_200_OK)
        else:
            return Response({"Pago rechazado"}, status=status.HTTP_400_BAD_REQUEST)
        

class Taller():
    nombre = "9xpertos"
    direccion = "calle 123"
    cuit = "11-111111-11"
    m_pagos= ["efectivo", "tarjeta"]

    @staticmethod
    def getVehiculo(patente):
        return Vehiculo.objects.get(patente=patente)

    @staticmethod
    def generarFactura(rto):
        factura = Factura.objects.create(rel_rto =rto)
        return factura
    
    @classmethod
    def mostrarMetodosDePago(cls):
        return cls.m_pagos

    @staticmethod
    def realizar_pago(request):
        mp = request.query_params.get('mp')
        id_factura = request.query_params.get('id_factura')
        factura = Factura.objects.get(id=id_factura)
        monto = int(request.query_params.get('monto'))


        if (mp == 'efectivo'):
            factura.pagado = True
            factura.save()
            return True
        elif(mp == 'tarjeta'):
            
            nro_tarjeta = request.query_params.get('nro_tarjeta')
            cod_seg = request.query_params.get('cod_seg')
            #fecha_actual = datetime.now().date()

            
            tarjeta = get_object_or_404(Tarjeta, nro=nro_tarjeta, cod_seguridad=cod_seg)

            if (tarjeta.saldo >= monto ):
                tarjeta.saldo = tarjeta.saldo-monto
                factura.pagado = True
                factura.save()
                tarjeta.save()
                return True
            else:
                return False
        else:
            return False




