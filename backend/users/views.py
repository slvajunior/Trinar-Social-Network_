""" backend/users/views.py """

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer


from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import logging


logger = logging.getLogger(__name__)


class RegisterUserView(APIView):
    """
    API View para registrar um novo usuário.
    """

    def post(self, request, *args, **kwargs):
        logger.info("Dados recebidos: %s", request.data)  # Log dos dados recebidos

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(
                "Usuário registrado com sucesso: %s", serializer.data
            )  # Log de sucesso
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error("Erros de validação: %s", serializer.errors)  # Log de erros
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    """
    API View para fazer login do usuário com JWT.
    """

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UploadProfilePictureView(APIView):
    def put(self, request, *args, **kwargs):
        user = request.user  # Obtém o usuário autenticado
        profile_picture = request.FILES.get("profile_picture")  # Obtém a foto enviada

        if not profile_picture:
            return Response({"error": "Nenhuma foto enviada."}, status=status.HTTP_400_BAD_REQUEST)

        # Salva a foto de perfil no campo `profile_picture` do usuário
        user.profile_picture = profile_picture
        user.save()

        # Retorna os dados atualizados do usuário
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
