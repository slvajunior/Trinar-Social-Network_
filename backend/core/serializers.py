# backend/core/serializers.py

from rest_framework import serializers
from .models import Post, Comment, Repost
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from users.models import User  # Importe o modelo User


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "profile_picture"]  # Campos do autor


class PostSerializer(serializers.ModelSerializer):
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    reposted_from = serializers.SerializerMethodField()
    author = AuthorSerializer(read_only=True)  # Inclui os dados do autor
    photo_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "text",
            "hashtags",
            "mentions",  # Campo many-to-many
            "visibility",
            "created_at",
            "updated_at",
            "reposted_from",
            "additional_text",  # Incluir texto adicional no serializer
            "likes_count",
            "comments_count",
            "photo",  # Campo de foto
            "video",  # Campo de vídeo
            "photo_url",
            "video_url",
        ]
        extra_kwargs = {
            "text": {"required": False, "allow_blank": True},  # Permite texto em branco
        }

    def get_photo_url(self, obj):
        if obj.photo:
            # Verifica se o contexto contém o objeto 'request'
            if "request" in self.context:
                return self.context["request"].build_absolute_uri(obj.photo.url)
            else:
                # Se o contexto não contiver 'request', retorna a URL relativa
                return obj.photo.url
        return None

    def get_video_url(self, obj):
        if obj.video:
            # Verifica se o contexto contém o objeto 'request'
            if "request" in self.context:
                return self.context["request"].build_absolute_uri(obj.video.url)
            else:
                # Se o contexto não contiver 'request', retorna a URL relativa
                return obj.video.url
        return None

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_reposted_from(self, obj):
        if obj.reposted_from:
            return PostSerializer(obj.reposted_from).data
        return None

    def create(self, validated_data):
        # Remove 'mentions' e 'reposted_from' do validated_data
        mentions_data = validated_data.pop("mentions", None)
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

        # Atribui os valores ao campo 'mentions' usando .set()
        if mentions_data:
            post.mentions.set(mentions_data)

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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adicione campos extras ao token se necessário
        token["email"] = user.email
        return token

    def validate(self, attrs):
        credentials = {"email": attrs.get("email"), "password": attrs.get("password")}

        user = authenticate(**credentials)
        if user is None:
            raise AuthenticationFailed(
                "Nenhum usuário encontrado com essas credenciais.", "no_active_account"
            )

        data = super().validate(attrs)
        return data
