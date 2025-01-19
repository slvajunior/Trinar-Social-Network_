from rest_framework import serializers
from .models import User
from core.serializers import PostSerializer


class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    password = serializers.CharField(write_only=True)  # Adiciona o campo password como write_only

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "birth_date",
            "first_name",
            "last_name",
            "email",
            "password",  # Inclui o campo password
            "followers_count",
            "following_count",
            "profile_picture",
            "created_at",
        )

    def create(self, validated_data):
        # Cria o usuário com os dados validados
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            birth_date=validated_data.get('birth_date', None),
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
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()
