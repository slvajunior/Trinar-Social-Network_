# backend/core/urls.py

from django.urls import path
from .views import (
    UserListCreateView,
    UserSearchView,
    LikePostView,
    CommentListCreateView,
    PostListCreateView,
    PostDetailView,
    RepostPostView,
)

app_name = "core"

urlpatterns = [
    path(
        "users/", UserListCreateView.as_view(), name="user-list-create"
    ),  # Endpoint para criar/listar usuários
    path(
        "users/search/", UserSearchView.as_view(), name="user-search"
    ),  # Endpoint para buscar usuários
    path(
        "posts/", PostListCreateView.as_view(), name="post-list-create"
    ),  # Endpoint para criar/listar postagens
    path(
        "posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"
    ),  # Endpoint para visualizar detalhes de um post
    path(
        "posts/<int:post_id>/like/", LikePostView.as_view(), name="like-post"
    ),  # Endpoint para curtir postagens
    path(
        "posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="comment-list-create",
    ),  # Endpoint para comentários nas postagens
    path(
        "posts/<int:post_id>/repost/", RepostPostView.as_view(), name="repost-post"
    ),  # Endpoint para repostar postagens
]
