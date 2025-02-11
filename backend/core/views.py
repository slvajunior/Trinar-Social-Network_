import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Repost, Like, Reaction, Comment
from django.db.models import Q
from django.db import models
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .serializers import PostSerializer, RepostSerializer, CommentSerializer
from users.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, UserSearchSerializer
# from django.contrib.postgres.aggregates import ArrayAgg

# from rest_framework import generics
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import NotFound
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination

# from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.decorators import login_required

# from rest_framework.permissions import AllowAny
# from django.core.exceptions import ObjectDoesNotExist

# from rest_framework.parsers import MultiPartParser, FormParser


logger = logging.getLogger(__name__)

User = get_user_model()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@login_required
def bulk_follow_status(request):
    user_ids = request.GET.getlist("user_ids")
    follow_statuses = {
        user_id: request.user.followers.filter(id=user_id).exists()
        for user_id in user_ids
    }
    return JsonResponse(follow_statuses)


def get_user_by_id(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise NotFound({"error": "User not found."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_reaction(request, post_id):
    try:
        # Busca o post
        post = get_object_or_404(Post, id=post_id)

        # Busca a reação do usuário logado para o post
        reaction = Reaction.objects.filter(post=post, user=request.user).first()

        # Retorna a reação do usuário, se existir
        return Response(
            {
                "status": "success",
                "reaction_type": reaction.reaction_type if reaction else None,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_post_reactions(request, post_id):
    try:
        # Verifica se o post existe
        post = get_object_or_404(Post, id=post_id)

        # Busca todas as reações do post, incluindo os usuários
        reactions = Reaction.objects.filter(post=post).select_related("user")

        # Inicializa reaction_data com arrays vazios para todos os tipos de reação
        reaction_data = {emoji: [] for emoji, _ in Reaction.REACTION_TYPES}

        # Popula reaction_data com as reações existentes
        for reaction in reactions:
            emoji = reaction.reaction_type
            user_name = f"{reaction.user.first_name or ''} {reaction.user.last_name or ''}".strip()
            reaction_data[emoji].append(user_name)

        # Retorna a contagem de reações
        reaction_counts = (
            Reaction.objects.filter(post=post)
            .values("reaction_type")
            .annotate(count=Count("reaction_type"))
            .order_by("-count")
        )

        return Response({
            "status": "success",
            "reactions": list(reaction_counts),
            "reaction_users": reaction_data  # Retorna os usuários que reagiram
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_reaction(request):
    post_id = request.data.get("post_id")
    reaction_type = request.data.get("reaction_type")
    user = request.user

    if not post_id or not reaction_type:
        return Response(
            {"status": "error", "message": "post_id and reaction_type are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        post = get_object_or_404(Post, id=post_id)

        # Verifica se o usuário já reagiu a este post
        existing_reaction = Reaction.objects.filter(post=post, user=user).first()

        if existing_reaction:
            if existing_reaction.reaction_type == reaction_type:
                # Se a reação for a mesma, remove a reação (desfazer)
                existing_reaction.delete()
                message = "Reaction removed successfully!"
            else:
                # Se a reação for diferente, troca a reação
                existing_reaction.reaction_type = reaction_type
                existing_reaction.save()
                message = "Reaction updated successfully!"
        else:
            # Se não houver reação, adiciona uma nova
            Reaction.objects.create(post=post, user=user, reaction_type=reaction_type)
            message = "Reaction added successfully!"

        # Atualiza a contagem de reações corretamente
        reaction_counts = (
            Reaction.objects.filter(post=post)
            .values("reaction_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        return Response(
            {
                "status": "success",
                "message": message,
                "reactions": list(reaction_counts),
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Adicionando autenticação
def add_like(request):
    post_id = request.data.get("post_id")
    user_id = request.user.id

    try:
        post = Post.objects.get(id=post_id)
        user = User.objects.get(id=user_id)

        # Verifica se o like já existe
        like, created = Like.objects.get_or_create(post=post, user=user)
        if not created:
            like.delete()  # Se já curtiu, desfaz o like
            return Response(
                {"status": "success", "message": "Like removed"},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"status": "success", "message": "Post liked"}, status=status.HTTP_200_OK
        )

    except Post.DoesNotExist:
        return Response(
            {"status": "error", "message": "Post not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Adicionando autenticação
def add_comment(request):
    post_id = request.data.get("post_id")
    text = request.data.get("text")
    user_id = request.user.id

    try:
        post = Post.objects.get(id=post_id)
        user = User.objects.get(id=user_id)

        comment = Comment.objects.create(post=post, author=user, text=text)
        return Response(
            {"status": "success", "comment_id": comment.id, "message": "Comment added"},
            status=status.HTTP_200_OK,
        )

    except Post.DoesNotExist:
        return Response(
            {"status": "error", "message": "Post not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Adicionando autenticação
def add_repost(request):
    post_id = request.data.get("post_id")
    text = request.data.get("text", "")  # Texto opcional para o repost
    user_id = request.user.id

    try:
        post = Post.objects.get(id=post_id)
        user = User.objects.get(id=user_id)

        # Criando o repost, mas não armazenando em uma variável
        Repost.objects.create(original_post=post, reposted_by=user, text=text)
        return Response(
            {"status": "success", "message": "Post reposted"}, status=status.HTTP_200_OK
        )

    except Post.DoesNotExist:
        return Response(
            {"status": "error", "message": "Post not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed as e:
            print("Erro de autenticação:", e)
            raise


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

        # Passa o contexto {'request': request} ao instanciar o serializer
        serializer = PostSerializer(posts, many=True, context={"request": request})
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
        # Cria uma cópia dos dados recebidos
        data = request.data.copy()

        # Adiciona os arquivos de mídia ao payload, se existirem
        if "photo" in request.FILES:
            data["photo"] = request.FILES["photo"]
        if "video" in request.FILES:
            data["video"] = request.FILES["video"]

        # Passa o contexto {'request': request} ao instanciar o serializer
        serializer = PostSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            # Garante que o autor seja o usuário autenticado
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Log dos erros de validação
        print("Erros de validação:", serializer.errors)
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


class UserPostsView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários autenticados podem acessar

    def get(self, request, user_id):
        posts = Post.objects.filter(author_id=user_id)
        if posts.exists():
            data = [
                {
                    "id": post.id,
                    "text": post.text,
                    "created_at": post.created_at,
                    "author": {
                        "id": post.author.id,
                        "name": post.author.username,
                        "profile_picture": (
                            post.author.profile_picture.url
                            if post.author.profile_picture
                            else None
                        ),
                    },
                }
                for post in posts
            ]
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Nenhum post encontrado."}, status=status.HTTP_404_NOT_FOUND
            )


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
        user_to_follow = get_user_by_id(user_id)
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

        user.following.add(user_to_follow)
        return Response(
            {"message": "Followed successfully."}, status=status.HTTP_200_OK
        )


class UserFollowersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_user_by_id(user_id)
        followers = user.followers.all().values("id", "username")
        return Response({"followers": list(followers)})


class UserFollowingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_user_by_id(user_id)
        following = user.following.all().values("id", "username")
        return Response({"following": list(following)})


class IsFollowingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if not request.user.is_authenticated:
            return Response({"error": "Usuário não autenticado."}, status=401)
        try:
            user_to_check = User.objects.get(id=user_id)
            is_following = user_to_check.followers.filter(id=request.user.id).exists()
            return Response({"is_following": is_following}, status=200)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=404)


class TimelineView(APIView):
    permission_classes = [IsAuthenticated]  # Exige autenticação

    def get(self, request):
        # Usuários que o usuário atual está seguindo
        following_users = request.user.following.all()

        # Filtrar posts públicos e posts de usuários seguidos com visibilidade "followers"
        posts = Post.objects.filter(
            models.Q(visibility="public")
            | models.Q(visibility="followers", author__in=following_users)
        ).order_by(
            "-created_at"
        )  # Ordena por data de criação, mais recentes primeiro

        # Paginar os posts
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Número de posts por página
        paginated_posts = paginator.paginate_queryset(posts, request)

        # Serializa os posts para enviar como resposta
        serializer = PostSerializer(
            paginated_posts, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


class UserSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q", "").strip()
        if not query:
            return Response(
                {"detail": "No query provided. Add ?q=term to the URL."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Busca pelo termo
        users = User.objects.filter(
            Q(username__icontains=query) | Q(email__icontains=query)
        )[:50]

        # Usa o serializer otimizado para buscas
        serializer = UserSearchSerializer(users, many=True)
        return Response(serializer.data)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            logger.info(
                f"Processing profile for user: {user.username if hasattr(user, 'username') else 'Anonymous'}"
            )

            profile_data = {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name or "",
                "last_name": user.last_name or "",
                "profile_picture": (
                    user.profile_picture.url if user.profile_picture else None
                ),
                "cover_photo": user.cover_photo.url if user.cover_photo else None,
                "bio": user.bio or "",
                "location": user.location or "",
                "birth_date": user.birth_date,
                "date_joined": user.date_joined,
                "followers_count": (
                    getattr(user, "followers", []).count()
                    if hasattr(user, "followers")
                    else 0
                ),
                "following_count": (
                    getattr(user, "following", []).count()
                    if hasattr(user, "following")
                    else 0
                ),
            }

            logger.info("Profile data generated successfully.")
            return Response(profile_data)

        except AttributeError as e:
            logger.error(f"Atributo ausente no usuário: {str(e)}")
            return Response(
                {"error": "Dados do perfil incompletos. Contate o suporte."}, status=400
            )

        except Exception as e:
            logger.error(f"Erro inesperado ao processar o perfil: {str(e)}")
            return Response({"error": "Erro interno do servidor."}, status=500)


# View simples para a URL raiz
def home(request):
    return JsonResponse({"message": "Bem-vindo à API Trinar!"})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
