""" backend/users/urls.py """

from django.urls import path
from .views import UserDetailView
from .views import RegisterUserView, LoginUserView
from . import views
from .views import email_verification, reset_password_confirm
from django.contrib.auth import views as auth_views
# from .views import UserProfileView, UserProfileEditView, UserPhotosView, UserProfilePhotoView
from .views import ProfileView, EditProfileView, UserDetailByIdView


app_name = 'users'


urlpatterns = [
    path("user/<int:id>/", UserDetailByIdView.as_view(), name="user-detail-by-id"),
    path(
        "upload_profile_picture/",
        views.UploadProfilePictureView.as_view(),
        name="upload_profile_picture",
    ),
    # path("api/users/me/", get_current_user, name="get_current_user"),
    # path("auth/user/", UserDetailView.as_view(), name="user_detail"),
    path("user/", UserDetailView.as_view(), name="user-detail"),
    path("register/", RegisterUserView.as_view(), name="register"),
    # path("login/", LoginUserView.as_view(), name="login"),
    path('api/auth/login/', LoginUserView.as_view(), name='login'),
    path("confirm-email/<str:token>/", email_verification, name="confirm-email"),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "password-reset/done/",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "password-reset/", auth_views.PasswordResetView.as_view(), name="password_reset"
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path(
        "api/password-reset-confirm/<uidb64>/<token>/",
        reset_password_confirm,
        name="password_reset_confirm",
    ),
    # path("users/", UserListCreateView.as_view(), name="user-list-create"),
    # path("profile/", UserProfileView.as_view(), name="user-profile"),
    # path('api/users/profile/edit/', UserProfileEditView.as_view(), name='user-profile-edit'),
    # path("profile/photos/", UserPhotosView.as_view(), name="user-photos"),
    # path('api/users/profile/photos/', UserProfilePhotoView.as_view(), name="profile-photo"),

    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/edit/', EditProfileView.as_view(), name='edit-profile'),
]
