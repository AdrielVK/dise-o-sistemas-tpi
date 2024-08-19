from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import *
from rest_framework.permissions import IsAuthenticated
from ..user.permissions import IsAtencion
from .serializers import *
from rest_framework.response import Response
from rest_framework import status, permissions

from django.http import HttpResponse
from rest_framework.views import APIView
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.utils import timezone

def search_rto(patente):
    vehiculo:Vehiculo = get_object_or_404(Vehiculo, patente=patente)
    rto:Rto = get_object_or_404(Rto, rel_vehiculo = vehiculo)
    return rto

def search_factura(rto:Rto):
    factura = get_object_or_404(Factura, rel_rto = rto)
    return factura

def pago_tarjeta(request,monto, format=None):
    tarjeta = get_object_or_404(Tarjeta, nro=request.data['nro'], cod_seguridad=request.data['cod_seguridad'])
    fecha_actual = timezone.now().date()

    if (fecha_actual <= tarjeta.fecha_vencimiento and tarjeta.saldo >=monto):
        tarjeta.saldo = tarjeta.saldo-monto
        tarjeta.save()
        return True
    else:
        return False

@permission_classes([IsAuthenticated, IsAtencion])
@api_view(['GET'])
def get_rto_and_factura_serialized(request):
    patente = request.query_params.get('patente')
    if not patente:
        return Response({"error": "Patente is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        rto = search_rto(patente)
        factura = search_factura(rto)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    rto_serializer = RtoSerializer(rto)
    factura_serializer = FacturaSerializer(factura)

    return Response({"rto": rto_serializer.data, "factura": factura_serializer.data}, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated, IsAtencion])
@api_view(['POST'])
def realizar_pago(request):
    patente = request.data.get('patente')
    vehiculo = get_object_or_404(Vehiculo, patente=patente)
    rto = search_rto(patente)
    factura = search_factura(rto)
    
    modo_de_pago = request.data['modo_de_pago']
    

    if modo_de_pago == 'efectivo':
        


        #BORRO LA RTO Y EL VEHICULO DE LA BD
        #factura.delete()
        vehiculo.delete()
        rto.delete()

        return Response({"success": "Pago exitoso"}, status=status.HTTP_200_OK)
    
    elif modo_de_pago == 'tarjeta':
        #if imprimir:
        #    imprimir_factura(factura)
        result = pago_tarjeta(request, factura.calcularMonto())

        if result:

            #'''BORRO LA RTO Y EL VEHICULO DE LA BD'''
            #factura.delete()
            vehiculo.delete()
            rto.delete()
            return Response({"success": "Pago exitoso"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Pago rechazado"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"error": "Modo de pago no soportado"}, status=status.HTTP_400_BAD_REQUEST)















import random
from datetime import date


@permission_classes([IsAuthenticated, IsAtencion])
@api_view(['POST'])
def create_factura(request):
    try:
        patente = request.data.get('patente')
        if not patente:
            return Response({"error": "Patente is required"}, status=status.HTTP_400_BAD_REQUEST)

        rto = search_rto(patente)
        
        #SE CREA UN NUMERO DE FACTURA RANDOM Y SE CONTROLA QUE NO EXISTA YA
        while True:
            nro_fac = random.randrange(10**9, 10**10)
            if not Factura.objects.filter(nro_factura=nro_fac).exists():
                break

        fecha = date.today()

        factura = Factura.objects.create(
            nro_factura=nro_fac,
            fecha_emision=fecha,
            rel_rto=rto
        )

        return Response({"success": "Factura created successfully", "factura_id": factura.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)