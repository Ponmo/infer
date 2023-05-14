from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("upload", views.upload, name="upload"),
    path("proxy_inference", views.proxy_inference, name="proxy_inference"),
    path("get_options", views.get_options, name='get_options'),
    path("register_api", views.register_api, name='register_api'),
    # path("hugging_inference", views.hugging_inference, name="hugging_inference"),
]