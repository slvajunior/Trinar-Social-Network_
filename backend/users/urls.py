""" backend/users/urls.py """

from django.urls import path
from .views import UserDetailView, UserListCreateView
from .views import RegisterUserView, LoginUserView, get_current_user
from . import views
from .views import email_verification, reset_password_confirm
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('upload_profile_picture/', views.UploadProfilePictureView.as_view(), name='upload_profile_picture'),
    path('api/users/me/', get_current_user, name='get_current_user'),
    path('auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('confirm-email/<str:token>/', email_verification, name='confirm-email'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('api/password-reset-confirm/<uidb64>/<token>/', reset_password_confirm, name='password_reset_confirm'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path("users/", UserListCreateView.as_view(), name="user-list-create"),
]
