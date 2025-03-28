from rest_framework import serializers
from .models import User, Photo
from core.serializers import PostSerializer


class UserSerializer(serializers.ModelSerializer):
    cover_photo_url = serializers.SerializerMethodField()
    profile_picture_url = serializers.SerializerMethodField()
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "birth_date",
            "first_name",
            "last_name",
            "email",
            "password",
            "profile_picture",
            "cover_photo",  # Foto de capa
            "bio",  # Biografia
            "followers_count",
            "following_count",
            "created_at",
            "profile_picture_url",  # URL completa da foto de perfil
            "cover_photo_url",  # URL completa da foto de capa
            "location",  # Novo campo de localidade
            "date_joined",
        )

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def get_cover_photo_url(self, obj):
        if obj.cover_photo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_photo.url)
            return obj.cover_photo.url
        return None

    def create(self, validated_data):
        # Cria o usuário com os dados validados
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            birth_date=validated_data.get("birth_date", None),
            location=validated_data.get(
                "location", ""
            ),  # Incluindo localidade no create
        )

        return user


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
            "profile_picture",
            "cover_photo",  # Foto de capa no detalhamento
            "bio",  # Biografia
            "location",  # Novo campo de localidade
            "date_joined",
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["id", "image", "description", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]
