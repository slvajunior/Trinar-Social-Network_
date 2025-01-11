# backend/core/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .models import Post, Comment, Repost, Like
from .serializers import UserSerializer
from .serializers import PostSerializer, RepostSerializer
from django.db.models import Q
from .serializers import CommentSerializer
from django.db import models
from django.shortcuts import get_object_or_404
from django.http import JsonResponse


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
    def get(self, request):
        if request.user.is_authenticated:
            posts = Post.objects.filter(
                Q(visibility="public") | Q(author__followers=request.user)
            )
        else:
            posts = Post.objects.filter(visibility="public")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
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
    def post(self, request, post_id):
        try:
            # Obtém o post com base no ID
            post = get_object_or_404(Post, id=post_id)

            # Verifica se o post é público ou o usuário segue o autor
            if post.visibility == 'public' or post.author in request.user.following.all():
                # Cria um novo objeto Like
                like, created = Like.objects.get_or_create(user=request.user, post=post)

                if created:
                    return Response({"detail": "Post liked successfully."}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"detail": "You already liked this post."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "You cannot like this post."}, status=status.HTTP_403_FORBIDDEN)

        except Post.DoesNotExist:
            return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)


class CommentListCreateView(APIView):
    def get(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)

            # Se o post for privado e o usuário não for seguidor, não deve ver os comentários
            if (
                post.visibility == "private"
                and request.user not in post.author.followers.all()
            ):
                return Response(
                    {"detail": "You cannot view comments on this private post."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Filtra os comentários de nível superior (sem parent)
            comments = post.comments.filter(parent=None)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)

            # Se o post for privado e o usuário não for seguidor, não deve poder comentar
            if (
                post.visibility == "private"
                and request.user not in post.author.followers.all()
            ):
                return Response(
                    {"detail": "You cannot comment on this private post."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            parent_comment = None
            parent_id = request.data.get("parent")

            if parent_id:
                try:
                    parent_comment = Comment.objects.get(id=parent_id)
                except Comment.DoesNotExist:
                    return Response(
                        {"detail": "Parent comment not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, post=post, parent=parent_comment)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND
            )


class RepostPostView(APIView):
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
