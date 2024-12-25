# backend/core/models.py

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.contrib.auth.hashers import make_password
import re


class UserManager(BaseUserManager):
    """Gerenciador de usuários personalizado."""

    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório.")
        if not username:
            raise ValueError("O nome de usuário é obrigatório.")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Modelo de usuário personalizado."""

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    followers = models.ManyToManyField(
        "self", symmetrical=False, related_name="following"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username

    @property
    def followers_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.following.count()

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password

        return check_password(raw_password, self.password)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class Post(models.Model):
    VISIBILITY_CHOICES = [
        ("public", "Público"),
        ("followers", "Somente seguidores"),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    reposted_from = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="reposts",
        related_query_name="reposted",
    )
    additional_text = models.TextField(blank=True)
    text = models.TextField(max_length=500)
    hashtags = models.JSONField(default=list, blank=True)
    mentions = models.ManyToManyField(
        User, related_name="mentioned_in_posts", blank=True
    )
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default="public"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Extrair hashtags
        self.hashtags = re.findall(r"#(\w+)", self.text)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.author.username} - {self.text[:30]}"

    @property
    def repost_count(self):
        return Post.objects.filter(reposted_from=self).count()

    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (
            "user",
            "post",
        )  # Garante que o usuário só pode curtir uma vez

    def __str__(self):
        return f"{self.user.username} liked {self.post.title}"


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username}: {self.text[:20]}"

    class Meta:
        ordering = ["created_at"]


class Repost(models.Model):
    original_post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="repost_instances",
        related_query_name="reposted_post",
    )
    reposted_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reposts"
    )
    text = models.TextField(blank=True)

    def __str__(self):
        return f"{self.reposted_by.username} reposted {self.original_post.text[:20]}"
