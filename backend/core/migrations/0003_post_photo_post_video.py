# Generated by Django 5.1.4 on 2025-01-22 23:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_alter_post_author_alter_like_user_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="photo",
            field=models.ImageField(blank=True, null=True, upload_to="posts/photos/"),
        ),
        migrations.AddField(
            model_name="post",
            name="video",
            field=models.FileField(blank=True, null=True, upload_to="posts/videos/"),
        ),
    ]
