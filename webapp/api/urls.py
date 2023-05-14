from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("upload", views.upload, name="upload"),
    path("proxy_inference", views.proxy_inference, name="proxy_inference"),
    path('', TemplateView.as_view(template_name="index.html")),
    path("get_options", views.get_options, name='get_options'),
    path("register_api", views.register_api, name='register_api'),
    path("", include("allauth.urls"))
    # path("hugging_inference", views.hugging_inference, name="hugging_inference"),
]