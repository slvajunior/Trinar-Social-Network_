# backend/core/models.py

from django.db import models
import re
from users.models import User


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

    # Novos campos
    photo = models.ImageField(upload_to="posts/photos/", null=True, blank=True)
    video = models.FileField(upload_to="posts/videos/", null=True, blank=True)

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
