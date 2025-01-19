""" backend/users/urls.py """

from django.urls import path
from .views import UserDetailView
from .views import RegisterUserView, LoginUserView
from . import views


urlpatterns = [
    path('upload_profile_picture/', views.UploadProfilePictureView.as_view(), name='upload_profile_picture'),

    path('auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
]
