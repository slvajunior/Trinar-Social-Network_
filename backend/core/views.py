# backend/core/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .models import Post, Repost, Like
from .serializers import UserSerializer
from .serializers import PostSerializer, RepostSerializer
from django.db.models import Q
from .serializers import CommentSerializer
from django.db import models
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
import logging

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
