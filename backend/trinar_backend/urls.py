# backend/trinar_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from core.views import PostListCreateView, PostDetailView, RepostPostView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Inclui as rotas do app 'core'
    path('api/', include('core.urls')),
    path('api/posts/', PostListCreateView.as_view(), name="post-list-create"),
    path('api/posts/<int:pk>/', PostDetailView.as_view(), name="post-detail"),
    path('posts/<int:post_id>/repost/', RepostPostView.as_view(), name='repost-post'),
]
