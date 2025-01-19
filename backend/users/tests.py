import os
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.urls import reverse


class UserProfileAPITestCase(APITestCase):

    def setUp(self):
        self.user = (
            get_user_model().objects.first()
            or get_user_model().objects.create_user(
                username="zuckerberg@gmail.com",
                password="i18abh",
                email="zuckerberg@gmail.com",
            )
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.url = reverse("user_detail")

        self.img_path = os.path.join(
            os.path.expanduser("~"), "Imagens", "Ego", "profile_picture.jpg"
        )

    def test_upload_profile_picture(self):
        self.assertTrue(
            os.path.exists(self.img_path),
            f"O arquivo de imagem não foi encontrado no caminho: {self.img_path}",
        )

        with open(self.img_path, "rb") as img:
            response = self.client.patch(
                self.url, {"profile_picture": img}, format="multipart"
            )

        self.assertEqual(response.status_code, 200)

    def test_user_profile_picture_in_response(self):
        with open(self.img_path, "rb") as img:
            response = self.client.patch(
                self.url, {"profile_picture": img}, format="multipart"
            )

        response = self.client.get(self.url)

        self.assertIn("profile_picture", response.data)

        self.assertTrue(
            response.data["profile_picture"].startswith("/media/profile_pictures/"),
            f"A imagem retornada não corresponde à esperada. Esperado que comece com '/media/profile_pictures/'. "
            f"Recebido: {response.data['profile_picture']}",
        )
