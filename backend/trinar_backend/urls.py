# backend/trinar_backend/urls.py
from django.conf import settings
from django.conf.urls.static import static


from django.contrib import admin
from django.urls import path, include, re_path
from core.views import PostListCreateView, PostDetailView, RepostPostView, home
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from core.views import email_verification, reset_password_confirm
from rest_framework.authtoken.views import obtain_auth_token
from core import views
from core.views import UserProfileView
from users.views import UploadProfilePictureView
from users.views import UserDetailView


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
    path("", home),
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path('api/auth/', include('users.urls')),
    path('api/auth/user/', UserProfileView.as_view(), name='user-profile'),
    path('api/users/me/', views.get_current_user, name='get_current_user'),

    path('api/auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('api/auth/user/upload_profile_picture/', UploadProfilePictureView.as_view(), name='upload_profile_picture'),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path('confirm-email/<str:token>/', email_verification, name='confirm-email'),
    path(
        "api/posts/", PostListCreateView.as_view(), name="post-list-create"
    ),
    path(
        "api/posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"
    ),
    path(
        "posts/<int:post_id>/repost/", RepostPostView.as_view(), name="repost-post"
    ),
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
    path('api/login/', obtain_auth_token, name='api_login'),
    path('api/password-reset-confirm/<uidb64>/<token>/', reset_password_confirm, name='password_reset_confirm'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
