from .views import *
from django.urls import path
from .views import realizar_pago,get_rto_and_factura_serialized

urlpatterns = [
    path('get_rto/', get_rto_and_factura_serialized, name='get_rto'),
    path('pagar/', realizar_pago, name='realizar_pago'),
]