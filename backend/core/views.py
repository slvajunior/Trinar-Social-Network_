import json
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Repost, Like
from django.db.models import Q
from django.db import models
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from .serializers import UserSerializer, PostSerializer, RepostSerializer, CommentSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from .utils import send_email_confirmation, confirm_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.views.decorators.http import require_POST
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.middleware.csrf import get_token
from core.utils import decode_confirmation_token
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.backends import ModelBackend


logger = logging.getLogger(__name__)

User = get_user_model()


@csrf_exempt
def request_password_reset(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            user = User.objects.filter(email=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
                send_mail(
                    'Redefinição de Senha',
                    f'Clique no link para redefinir sua senha: {reset_url}',
                    'noreply@trinar.com',
                    [email],
                    fail_silently=False,
                )
                return JsonResponse({'message': 'Email de redefinição enviado.'}, status=200)
            else:
                return JsonResponse({'error': 'Email não encontrado.'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Dados inválidos.'}, status=400)
    return JsonResponse({'error': 'Método não permitido.'}, status=405)


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
            new_password = data.get('new_password')

            # Valida a nova senha
            if not new_password or len(new_password) < 8:
                return JsonResponse({'error': 'A senha deve ter pelo menos 8 caracteres.'}, status=400)

            # Redefine a senha
            user.set_password(new_password)
            user.save()

            # Garante que o CSRF está configurado corretamente
            csrf_token = get_token(request)

            logger.info(f"Senha redefinida com sucesso para o usuário: {user.email}")

            return JsonResponse({'message': 'Senha redefinida com sucesso.'}, status=200)
        else:
            logger.warning(f"Token inválido para o usuário: {user.email}")
            return JsonResponse({'error': 'Token inválido.'}, status=400)
    except (TypeError, ValueError, OverflowError, user.DoesNotExist) as e:
        logger.error(f"Erro ao redefinir a senha: {str(e)}")
        return JsonResponse({'error': 'Link inválido ou usuário não encontrado.'}, status=400)


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


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_email_confirmation(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


# views.py
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print("Usuário autenticado:", user.username)  # Log para depuração
        return Response({
            'first_name': user.first_name,
            'last_name': user.last_name
        })


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed as e:
            print("Erro de autenticação:", e)
            raise



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


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="""Retorna uma lista de posts.
        Se o usuário estiver autenticado, retorna posts públicos e posts de usuários que ele segue.
        Caso contrário, retorna apenas posts públicos.""",
        responses={
            200: PostSerializer(many=True),  # Exemplo de resposta
            401: "Usuário não autenticado",  # Resposta de erro
        },
    )
    def get(self, request):
        if request.user.is_authenticated:
            posts = Post.objects.filter(
                Q(visibility="public") | Q(author__followers=request.user)
            )
        else:
            posts = Post.objects.filter(visibility="public")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Cria um novo post. O autor do post será o usuário autenticado.",
        request_body=PostSerializer,  # Exemplo de requisição
        responses={
            201: PostSerializer(),  # Exemplo de resposta em caso de sucesso
            400: "Dados inválidos",  # Resposta de erro
            401: "Usuário não autenticado",  # Resposta de erro
        },
    )
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return None

    def put(self, request, pk):
        post = self.get_object(pk)
        if post and post.author == request.user:
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        post = self.get_object(pk)
        if post and post.author == request.user:
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            # Obtém o post com base no ID
            post = get_object_or_404(Post, id=post_id)

            # Verifica se o post é público ou o usuário segue o autor
            if (
                post.visibility == "public"
                or post.author in request.user.following.all()
            ):
                # Cria um novo objeto Like
                like, created = Like.objects.get_or_create(user=request.user, post=post)

                if created:
                    return Response(
                        {"detail": "Post liked successfully."},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"detail": "You already liked this post."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {"detail": "You cannot like this post."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )


class CommentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)

            # Verifica se o usuário pode comentar no post
            if (
                post.visibility == "followers"
                and request.user not in post.author.followers.all()
            ):
                return Response(
                    {"detail": "You cannot comment on this post."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Adiciona o post aos dados da requisição
            request.data["post"] = post.id

            # Cria o comentário
            serializer = CommentSerializer(
                data=request.data, context={"request": request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                # Log dos erros de validação
                logger.error(f"Erros de validação: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )


class RepostPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)  # Tenta pegar o post original
            if request.user.is_authenticated:
                text = request.data.get("text", "")  # Texto adicional do repost
                repost = Repost.objects.create(
                    original_post=post, reposted_by=request.user, text=text
                )  # Cria o repost
                repost_serializer = RepostSerializer(
                    repost
                )  # Serializa o repost para responder com os dados
                return Response(
                    repost_serializer.data, status=status.HTTP_201_CREATED
                )  # Retorna o repost criado
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )


class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        user_to_follow = User.objects.get(id=user_id)
        user = request.user

        if user == user_to_follow:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user_to_follow in user.following.all():
            user.following.remove(user_to_follow)
            return Response(
                {"message": "Unfollowed successfully."}, status=status.HTTP_200_OK
            )
        else:
            user.following.add(user_to_follow)
            return Response(
                {"message": "Followed successfully."}, status=status.HTTP_200_OK
            )


class UserFollowersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        followers = user.followers.all()
        followers_data = [
            {"id": follower.id, "username": follower.username} for follower in followers
        ]
        return Response({"followers": followers_data})


class UserFollowingView(APIView):

    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        following = user.following.all()
        following_data = [
            {"id": following_user.id, "username": following_user.username}
            for following_user in following
        ]
        return Response({"following": following_data})


class TimelineView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            # Filtra os posts com base na visibilidade e no autor (quem o usuário está seguindo)
            following_users = request.user.following.all()
            posts = Post.objects.filter(
                models.Q(visibility="public") | models.Q(author__in=following_users)
            ).order_by(
                "-created_at"
            )  # Ordem por data (mais recentes primeiro)
        else:
            # Se não estiver autenticado, mostra apenas posts públicos
            posts = Post.objects.filter(visibility="public").order_by("-created_at")

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


class UserSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q", "")  # Parâmetro de consulta
        if query:
            # Filtra usuários pelo nome de usuário ou email
            users = User.objects.filter(
                Q(username__icontains=query) | Q(email__icontains=query)
            )
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        return Response(
            {"detail": "No query provided"}, status=status.HTTP_400_BAD_REQUEST
        )


# View simples para a URL raiz
def home(request):
    return JsonResponse({"message": "Bem-vindo à API Trinar!"})


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
