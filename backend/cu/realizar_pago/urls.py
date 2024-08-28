from .views import *
from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pagar', UI, basename='pagar')


urlpatterns = [
    path('', include(router.urls))
]