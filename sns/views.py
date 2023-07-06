import json

from django import http, views
from django.contrib.auth.decorators import login_required
from django.middleware import csrf
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect

from sns.models import Post


@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class CsrfTokenView(views.View):
    def get(self, request: http.HttpRequest) -> http.HttpResponse:
        return http.JsonResponse({'csrfToken': csrf.get_token(request)})


@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_protect, name='dispatch')
class PostListView(views.View):
    def get(self, request: http.HttpRequest) -> http.HttpResponse:
        posts = Post.objects.filter(user=request.user).order_by('-created_at')
        return http.JsonResponse({'posts': [
            {'id': post.id, 'title': post.title, 'content': post.content}
            for post in posts
        ]})

    def post(self, request: http.HttpRequest) -> http.HttpResponse:
        body = json.loads(request.body)
        post = Post.objects.create(
            user=request.user,
            title=body['title'],
            content=body['content'],
        )
        return http.JsonResponse({'id': post.id})


@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_protect, name='dispatch')
class PostView(views.View):
    def get(self, request: http.HttpRequest, id: int) -> http.HttpResponse:
        post = Post.objects.get(id=id)
        return http.JsonResponse({
            'id': post.id,
            'title': post.title,
            'content': post.content,
        })

    def put(self, request: http.HttpRequest, id: int) -> http.HttpResponse:
        body = json.loads(request.body)
        post = Post.objects.get(id=id)
        post.title = body['title']
        post.content = body['content']
        post.save()
        return http.HttpResponse(status=204)

    def delete(self, request: http.HttpRequest, id: int) -> http.HttpResponse:
        Post.objects.get(id=id).delete()
        return http.HttpResponse(status=204)
