from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    followers = models.ManyToManyField("self", symmetrical=False, related_name="following")
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=100, blank=True)  # Campo de localidade

    groups = models.ManyToManyField(
        "auth.Group", related_name="custom_user_groups", blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission", related_name="custom_user_permissions", blank=True
    )

    profile_picture = models.ImageField(upload_to="profile_pictures/", null=True, blank=True)
    cover_photo = models.ImageField(upload_to="cover_photos/", null=True, blank=True)  # Foto de capa
    bio = models.TextField(blank=True)  # Biografia

    def __str__(self):
        return self.username

    @property
    def followers_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.following.count()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="user_photos/")
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo {self.id} by {self.user.username}"
