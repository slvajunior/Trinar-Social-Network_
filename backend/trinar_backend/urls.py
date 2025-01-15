# backend/trinar_backend/urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from core.views import PostListCreateView, PostDetailView, RepostPostView, home
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from core.views import email_verification, reset_password_confirm


# Configuração do Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Trinar Social Network API",
        default_version="v1",
        description="API documentation for Trinar Social Network",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="seu-email@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('confirm-email/<str:token>/', email_verification, name='confirm-email'),

    path("", home),
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
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
    path('api/password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('api/password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path(
        'api/password-reset-confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'),
    path(
        'api/password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(),
        name='password_reset_complete'),
    path('api/login/', auth_views.LoginView.as_view(), name='login'),
    path('api/password-reset-confirm/<uidb64>/<token>/', reset_password_confirm, name='password_reset_confirm'),
]
