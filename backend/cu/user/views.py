from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import AccessToken
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from .models import User
from .permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"error": "Contrasena invalida"}, status=status.HTTP_400_BAD_REQUEST)
    
    refresh = RefreshToken.for_user(user)
    token= AccessToken.for_user(user)
    serializer = UserSerializer(instance=user)

    return Response({"access" : str(token),"refresh": str(refresh), "user": serializer.data}, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated, IsAdmin])
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    role = request.data.get('role')
    password = request.data.get('password')

    if not username or not role or not password:
        return Response({"error": "Todos los campos son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, role=role, password=password)
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is missing"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Received refresh_token: {refresh_token}")

        try:
            token = RefreshToken(refresh_token)
            print(f"Token object created: {token}")
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(f"Error while creating or blacklisting token: {str(e)}")
            return Response({"error": "Invalid token or token could not be blacklisted"}, status=status.HTTP_400_BAD_REQUEST)
    
    except KeyError as e:
        return Response({"error": f"Key error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"General error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)