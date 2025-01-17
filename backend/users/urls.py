""" backend/users/urls.py """

from django.urls import path
from .views import UserDetailView
from .views import RegisterUserView, LoginUserView
from .views import UploadProfilePictureView

urlpatterns = [
    path("upload-profile-picture/", UploadProfilePictureView.as_view(), name="upload_profile_picture"),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
]
