# backend/core/serializers.py

from rest_framework import serializers
from .models import Post, Comment, User, Repost


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "followers"]


class PostSerializer(serializers.ModelSerializer):
    reposted_from = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "text",
            "hashtags",
            "mentions",
            "visibility",
            "created_at",
            "updated_at",
            "reposted_from",
            "additional_text",  # Incluir texto adicional no serializer
        ]

    def get_reposted_from(self, obj):
        if obj.reposted_from:
            return PostSerializer(obj.reposted_from).data
        return None

    def create(self, validated_data):
        additional_text = validated_data.get('additional_text', '')
        reposted_from = validated_data.get('reposted_from', None)

        if reposted_from:
            validated_data['text'] = f"Repost: {reposted_from.text} - {additional_text}"

        return super().create(validated_data)


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'parent', 'replies']

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data


class RepostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repost
        fields = ['id', 'original_post', 'reposted_by', 'text', 'created_at']
