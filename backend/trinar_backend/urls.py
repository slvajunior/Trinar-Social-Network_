# backend/trinar_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from core.views import PostListCreateView, PostDetailView, RepostPostView, home

urlpatterns = [
    path('', home),
    path("admin/", admin.site.urls),
    # Inclui as rotas do app 'core'
    path(
        "api/", include("core.urls")
    ),  # Adiciona as rotas da API que você configurou em 'core/urls.py'
    path(
        "api/posts/", PostListCreateView.as_view(), name="post-list-create"
    ),  # Endpoint para criar e listar posts
    path(
        "api/posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"
    ),  # Endpoint para detalhar um post
    path(
        "posts/<int:post_id>/repost/", RepostPostView.as_view(), name="repost-post"
    ),  # Endpoint para repostar
]
