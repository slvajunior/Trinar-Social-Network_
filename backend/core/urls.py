# backend/core/urls.py

from django.contrib.auth import views as auth_views
from django.urls import path
from . import views


from .views import (
    PostListCreateView,
    PostDetailView,
    LikePostView,
    CommentListCreateView,
    RepostPostView,
    UserFollowersView,
    UserFollowingView,
    TimelineView,
    UserSearchView,
    IsFollowingView,
    FollowUserView,
    UserProfileView,
    bulk_follow_status,
    UserPostsView,
)

app_name = "core"

urlpatterns = [
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
    path("posts/", PostListCreateView.as_view(), name="post-list-create"),
    path("posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"),
    path("posts/<int:post_id>/like/", LikePostView.as_view(), name="like-post"),
    path(
        "posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="comment-list-create",
    ),

    path("posts/<int:post_id>/repost/", RepostPostView.as_view(), name="repost-post"),
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
    path('timeline/', TimelineView.as_view(), name='timeline'),
    path("search/", UserSearchView.as_view(), name="user-search"),
    path("users/<int:user_id>/is-following/", IsFollowingView.as_view(), name="is-following"),
    path("users/<int:user_id>/follow/", FollowUserView.as_view(), name="follow-user"),
    path("api/users/profile/", UserProfileView.as_view(), name="user-profile"),
    path("api/auth/user/", UserProfileView.as_view(), name="user-profile"),
    path("bulk-follow-status/", bulk_follow_status, name="bulk-follow-status"),

    path('posts/user/<int:user_id>/', UserPostsView.as_view(), name='user-posts'),
    path('add_reaction/', views.add_reaction, name='add_reaction'),
    path('add_like/', views.add_like, name='add_like'),
    path('add_comment/', views.add_comment, name='add_comment'),
    path('add_repost/', views.add_repost, name='add_repost'),
]
