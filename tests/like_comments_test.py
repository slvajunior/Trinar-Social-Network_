from django.urls import reverse
from rest_framework.test import APITestCase
from backend.core.models import User, Post
from rest_framework import status


class PostTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.login(username='testuser', password='testpass123')

    def test_create_post(self):
        url = reverse('post-list-create')
        data = {'text': 'Test post'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
