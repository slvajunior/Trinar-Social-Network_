from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Post
from rest_framework_simplejwt.tokens import AccessToken


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpass123"
        )
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_obtain_token(self):
        url = reverse("token_obtain_pair")
        data = {"username": "testuser", "password": "testpass123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_access_protected_endpoint(self):
        url = reverse("post-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PostTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpass123"
        )
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_create_post(self):
        url = reverse("post-list-create")
        data = {
            "text": "Test post",
            "visibility": "public",
            "author": self.user.id,  # Adicionar o ID do autor
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)

    def test_update_post(self):
        post = Post.objects.create(
            author=self.user, text="Original text", visibility="public"
        )
        url = reverse("post-detail", args=[post.id])
        data = {"text": "Updated text", "visibility": "public"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post.refresh_from_db()
        self.assertEqual(post.text, "Updated text")

    def test_delete_post(self):
        post = Post.objects.create(
            author=self.user, text="Test post", visibility="public"
        )
        url = reverse("post-detail", args=[post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)


class LikeCommentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpass123"
        )
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.post = Post.objects.create(
            author=self.user, text="Test post", visibility="public"
        )

    def test_like_post(self):
        url = reverse("like-post", args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.post.likes.count(), 1)

    def test_comment_post(self):
        url = reverse("comment-list-create", args=[self.post.id])
        data = {
            "text": "Test comment",  # Removemos o campo 'post'
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.post.comments.count(), 1)
