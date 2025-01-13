# backend/core/urls.py

from django.contrib.auth import views as auth_views
from .views import RegisterView, email_verification
from django.urls import path

from .views import (
    UserListCreateView,
    PostListCreateView,
    PostDetailView,
    LikePostView,
    CommentListCreateView,
    RepostPostView,
    FollowUserView,
    UserFollowersView,
    UserFollowingView,
    TimelineView,
    UserSearchView,
)

app_name = "core"

urlpatterns = [
    path('confirm-email/<str:token>/', email_verification, name='confirm-email'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('register/', RegisterView.as_view(), name='register'),
    path("users/", UserListCreateView.as_view(), name="user-list-create"),
    path("posts/", PostListCreateView.as_view(), name="post-list-create"),
    path("posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"),
    path("posts/<int:post_id>/like/", LikePostView.as_view(), name="like-post"),
    path(
        "posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="comment-list-create",
    ),
    path("posts/<int:post_id>/repost/", RepostPostView.as_view(), name="repost-post"),
    path("users/<int:user_id>/follow/", FollowUserView.as_view(), name="follow-user"),
    path(
        "users/<int:user_id>/followers/",
        UserFollowersView.as_view(),
        name="user-followers",
    ),
    path(
        "users/<int:user_id>/following/",
        UserFollowingView.as_view(),
        name="user-following",
    ),
    path("timeline/", TimelineView.as_view(), name="timeline"),
    path("search/", UserSearchView.as_view(), name="user-search"),
]
