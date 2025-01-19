""" backend/users/views.py """

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import logging

from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile


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
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        user = request.user
        if "profile_picture" in request.FILES:
            user.profile_picture = request.FILES["profile_picture"]
            user.save()
            return Response(
                {"status": "success", "message": "Profile picture updated!"}
            )
        return Response(
            {"status": "error", "message": "No picture uploaded"}, status=400
        )

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response(
            {
                "profile_picture": (
                    user.profile_picture.url if user.profile_picture else None
                ),
                "first_name": user.first_name,  # Adiciona o first_name
                "last_name": user.last_name,    # Adiciona o last_name
            }
        )


class UploadProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        profile_picture = request.FILES.get("profile_picture")

        if not profile_picture:
            return Response(
                {"error": "Nenhuma foto enviada."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Abre a imagem com o PIL
            img = Image.open(profile_picture)
            print(f"Tamanho original da imagem: {img.size}")  # Debug: Verifica o tamanho original

            # Faz o crop da imagem para mantê-la quadrada, usando a parte superior como referência
            width, height = img.size
            min_dimension = min(width, height)
            left = (width - min_dimension) // 2
            top = 0  # Crop a partir do topo
            right = left + min_dimension
            bottom = top + min_dimension
            img = img.crop((left, top, right, bottom))
            print(f"Tamanho após o crop: {img.size}")  # Debug: Verifica o tamanho após o crop

            # Redimensiona a imagem para 400x400 pixels
            img = img.resize((400, 400), Image.ANTIALIAS)
            print(f"Tamanho após redimensionamento: {img.size}")  # Debug: Verifica o tamanho após redimensionamento

            # Salva a imagem redimensionada em memória
            buffer = BytesIO()
            img.save(buffer, format='JPEG')  # Salva como JPEG
            buffer.seek(0)

            # Cria um arquivo Django a partir do conteúdo
            file_name = f"profile_picture_{user.id}.jpg"  # Nome único para o arquivo
            resized_image = ContentFile(buffer.read(), name=file_name)

            # Remove a imagem antiga (se existir)
            if user.profile_picture:
                user.profile_picture.delete(save=False)

            # Salva a nova imagem no campo profile_picture
            user.profile_picture.save(file_name, resized_image, save=True)
            print(f"Imagem salva em: {user.profile_picture.path}")  # Debug: Verifica o caminho do arquivo salvo

            # Serializa os dados do usuário e retorna a resposta
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Erro durante o processamento da imagem: {str(e)}")  # Debug: Log de erro
            return Response(
                {"error": f"Erro ao processar a imagem: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
