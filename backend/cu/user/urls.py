from .views import *
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='user_logout'),
    path('register/', register, name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('user/me/', get_user, name='user-detail'),
]