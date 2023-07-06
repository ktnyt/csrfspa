from turtle import update

from django.db import models


# Create your models here.
class Post(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
