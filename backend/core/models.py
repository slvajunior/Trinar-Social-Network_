# backend/core/models.py

from django.db import models
import re
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)  # Adicionando first_name
    last_name = models.CharField(max_length=30, blank=True)   # Adicionando last_name
    birth_date = models.DateField(null=True, blank=True)      # Adicionando birth_date
    followers = models.ManyToManyField(
        "self", symmetrical=False, related_name="following"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # Adicionando 'related_name' para resolver o conflito de 'groups' e 'user_permissions'
    groups = models.ManyToManyField(
        "auth.Group", related_name="custom_user_set", blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission", related_name="custom_user_set", blank=True
    )

    def __str__(self):
        return self.username

    @property
    def followers_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.following.count()  # Corrigido: estava 'following_count.count()'

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password

        return check_password(raw_password, self.password)


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
