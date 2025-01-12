# backend/core/serializers.py

from rest_framework import serializers
from .models import Post, Comment, User, Repost


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'birth_date']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            birth_date=validated_data.get('birth_date', None),
        )
        return user


class PostSerializer(serializers.ModelSerializer):
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    reposted_from = serializers.SerializerMethodField()

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
            "likes_count",
            "comments_count",
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_reposted_from(self, obj):
        if obj.reposted_from:
            return PostSerializer(obj.reposted_from).data
        return None

    def create(self, validated_data):
        # Remove 'reposted_from' do validated_data, pois é uma relação
        reposted_from_id = validated_data.pop("reposted_from", None)
        additional_text = validated_data.get("additional_text", "")

        # Cria o post
        post = Post.objects.create(**validated_data)

        # Se for um repost, associa o post original
        if reposted_from_id:
            reposted_from = Post.objects.get(id=reposted_from_id)
            post.reposted_from = reposted_from
            post.text = f"Repost: {reposted_from.text} - {additional_text}"
            post.save()

        return post


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)  # Campo read-only

    class Meta:
        model = Comment
        fields = ["id", "author", "post", "text", "created_at"]

    def create(self, validated_data):
        # Adiciona o autor automaticamente a partir do contexto da requisição
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)


class RepostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repost
        fields = ["id", "original_post", "reposted_by", "text", "created_at"]


class UserDetailSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "followers_count",
            "following_count",
            "posts",
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()
