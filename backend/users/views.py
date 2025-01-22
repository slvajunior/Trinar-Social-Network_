import json
import logging
from io import BytesIO
from PIL import Image
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.tokens import default_token_generator
from django.core.files.base import ContentFile
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import confirm_token, send_email_confirmation, send_email_reset_confirmation
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer
from .models import User
from django.http import HttpResponse, HttpResponseRedirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

# from .serializers import PhotoSerializer
# from .models import Photo
from rest_framework import generics, permissions


# Inicializa o logger
logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


class RegisterUserView(APIView):
    """
    API View para registrar um novo usuário.
    """

    def post(self, request, *args, **kwargs):
        logger.info("Dados recebidos: %s", request.data)  # Log dos dados recebidos

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(
                "Usuário registrado com sucesso: %s", serializer.data
            )  # Log de sucesso

            # Enviar email de confirmação
            send_email_confirmation(user)
            logger.info("Email de confirmação enviado para: %s", user.email)

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
                "last_name": user.last_name,  # Adiciona o last_name
            }
        )


class UserListCreateView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@csrf_exempt
def request_password_reset(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            user = User.objects.filter(email=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
                send_mail(
                    "Redefinição de Senha",
                    f"Clique no link para redefinir sua senha: {reset_url}",
                    "noreply@trinar.com",
                    [email],
                    fail_silently=False,
                )
                return JsonResponse(
                    {"message": "Email de redefinição enviado."}, status=200
                )
            else:
                return JsonResponse({"error": "Email não encontrado."}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Dados inválidos."}, status=400)
    return JsonResponse({"error": "Método não permitido."}, status=405)


@ensure_csrf_cookie
@require_POST
def reset_password_confirm(request, uidb64, token):
    try:
        # Decodifica o UID
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)  # Obtém o usuário com base no UID

        # Verifica se o token é válido
        if default_token_generator.check_token(user, token):
            # Decodifica o corpo da requisição JSON
            data = json.loads(request.body)
            new_password = data.get("new_password")

            # Valida a nova senha
            if not new_password or len(new_password) < 8:
                return JsonResponse(
                    {"error": "A senha deve ter pelo menos 8 caracteres."}, status=400
                )

            # Redefine a senha
            user.set_password(new_password)
            user.save()

            # Envia o e-mail de confirmação de redefinição de senha
            send_email_reset_confirmation(user)
            logger.info(
                f"E-mail de confirmação de redefinição de senha enviado para: {user.email}"
            )

            return JsonResponse(
                {"message": "Senha redefinida com sucesso."}, status=200
            )
        else:
            logger.warning(f"Token inválido para o usuário: {user.email}")
            return JsonResponse({"error": "Token inválido."}, status=400)
    except (TypeError, ValueError, OverflowError, user.DoesNotExist) as e:
        logger.error(f"Erro ao redefinir a senha: {str(e)}")
        return JsonResponse(
            {"error": "Link inválido ou usuário não encontrado."}, status=400
        )


def email_verification(request, token):
    email = confirm_token(token)
    if email is None:
        return HttpResponse("Token inválido ou expirado.", status=400)

    user = get_object_or_404(User, email=email)
    user.is_active = True
    user.save()

    frontend_url = "http://localhost:5173/email-confirmed"
    print(f"Redirecionando para: {frontend_url}")
    return HttpResponseRedirect(frontend_url)


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed as e:
            print("Erro de autenticação:", e)
            raise


""" AREA DA PAGINA PERFIL DO USUARIO E EDIT PROFILE USERS"""


# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         user = request.user  # Obtém o usuário autenticado
#         serializer = UserSerializer(user)
#         return Response(serializer.data)


# class UserProfileEditView(APIView):
#     permission_classes = [IsAuthenticated]

#     def put(self, request, *args, **kwargs):
#         user = request.user
#         # Dados do usuário
#         username = request.data.get("username")
#         email = request.data.get("email")  # Exemplo para outros dados

#         # Atualiza os dados do usuário
#         if username:
#             user.username = username
#         if email:
#             user.email = email

#         # Foto de perfil
#         profile_picture = request.FILES.get("profile_picture")
#         if profile_picture:
#             try:
#                 # Processamento da imagem aqui (se existir foto nova)
#                 img = Image.open(profile_picture)
#                 # Redimensionamento e edição, como você já fez
#                 buffer = BytesIO()
#                 img.save(buffer, format="JPEG")
#                 buffer.seek(0)
#                 file_name = f"profile_picture_{user.id}.jpg"
#                 resized_image = ContentFile(buffer.read(), name=file_name)
#                 if user.profile_picture:
#                     user.profile_picture.delete(save=False)
#                 user.profile_picture.save(file_name, resized_image, save=True)
#             except Exception as e:
#                 return Response(
#                     {"error": f"Erro ao processar a imagem: {str(e)}"},
#                     status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 )

#         # Salvar no banco
#         user.save()

#         # Retorna os dados atualizados
#         serializer = UserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# class UserPhotosView(APIView):
#     permission_classes = [IsAuthenticated]
#     parser_classes = [MultiPartParser, FormParser]

#     def get(self, request, *args, **kwargs):
#         photos = Photo.objects.filter(user=request.user)
#         serializer = PhotoSerializer(photos, many=True)
#         return Response(serializer.data)

#     def put(self, request, *args, **kwargs):
#         # Exemplo de como processar a imagem enviada no `PUT`
#         cover_picture = request.data.get("cover_picture")
#         if cover_picture:
#             # Associe a imagem ao usuário autenticado
#             request.user.cover_picture = cover_picture
#             request.user.save()
#             return Response(
#                 {"detail": "Foto de capa atualizada com sucesso!"},
#                 status=status.HTTP_200_OK,
#             )
#         return Response(
#             {"detail": "Nenhuma imagem enviada."}, status=status.HTTP_400_BAD_REQUEST
#         )


# class UserProfilePhotoView(APIView):
#     permission_classes = [IsAuthenticated]
#     parser_classes = [MultiPartParser]  # Responsável por processar o arquivo

#     def put(self, request, *args, **kwargs):
#         user = request.user  # Usuário autenticado
#         cover_picture = request.FILES.get(
#             "cover_photo"
#         )  # Verificando o campo de foto de capa

#         if not cover_picture:
#             return Response(
#                 {"error": "Nenhuma foto enviada."}, status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             # Lógica para processar a foto, por exemplo redimensionando e salvando
#             img = Image.open(cover_picture)
#             print(f"Tamanho original da imagem: {img.size}")

#             # Opções de manipulação da imagem podem ser aplicadas aqui (como redimensionamento)
#             img = img.resize((800, 800))  # Exemplo de redimensionamento

#             # Salva a imagem em memória
#             buffer = BytesIO()
#             img.save(buffer, format="JPEG")
#             buffer.seek(0)
#             file_name = f"cover_picture_{user.id}.jpg"
#             resized_image = ContentFile(buffer.read(), name=file_name)

#             if user.cover_photo:
#                 user.cover_photo.delete(save=False)  # Deleta foto anterior, se existir

#             user.cover_photo.save(
#                 file_name, resized_image, save=True
#             )  # Salva a nova imagem
#             print(f"Imagem de capa salva em: {user.cover_photo.path}")

#             # Retorna os dados do usuário após o upload
#             serializer = UserSerializer(user)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response(
#                 {"error": f"Erro ao processar a imagem: {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )


"""
O CODIGO ABAIXO É FORNECIDO PELO DEEPSEEK O DE CIMA É UM BOSTA DO CHATGPT
"""


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  # Obtém o usuário autenticado
        serializer = UserSerializer(user)
        return Response(serializer.data)


class EditProfileView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Importante para receber arquivos

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


"""
AREA DE UPLOAD DE FOTOS DO USUARIO E UPLOAD DE FOTO DE PERFIL DO USUARIO
"""


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
            print(
                f"Tamanho original da imagem: {img.size}"
            )  # Debug: Verifica o tamanho original

            # Faz o crop da imagem para mantê-la quadrada, usando a parte superior como referência
            width, height = img.size
            min_dimension = min(width, height)
            left = (width - min_dimension) // 2
            top = 0  # Crop a partir do topo
            right = left + min_dimension
            bottom = top + min_dimension
            img = img.crop((left, top, right, bottom))
            print(
                f"Tamanho após o crop: {img.size}"
            )  # Debug: Verifica o tamanho após o crop

            # Redimensiona a imagem para 400x400 pixels
            img = img.resize((400, 400), Image.ANTIALIAS)
            print(
                f"Tamanho após redimensionamento: {img.size}"
            )  # Debug: Verifica o tamanho após redimensionamento

            # Salva a imagem redimensionada em memória
            buffer = BytesIO()
            img.save(buffer, format="JPEG")  # Salva como JPEG
            buffer.seek(0)

            # Cria um arquivo Django a partir do conteúdo
            file_name = f"profile_picture_{user.id}.jpg"  # Nome único para o arquivo
            resized_image = ContentFile(buffer.read(), name=file_name)

            # Remove a imagem antiga (se existir)
            if user.profile_picture:
                user.profile_picture.delete(save=False)

            # Salva a nova imagem no campo profile_picture
            user.profile_picture.save(file_name, resized_image, save=True)
            print(
                f"Imagem salva em: {user.profile_picture.path}"
            )  # Debug: Verifica o caminho do arquivo salvo

            # Serializa os dados do usuário e retorna a resposta
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(
                f"Erro durante o processamento da imagem: {str(e)}"
            )  # Debug: Log de erro
            return Response(
                {"error": f"Erro ao processar a imagem: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
