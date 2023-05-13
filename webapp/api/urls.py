from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("proxy_inference", views.proxy_inference, name="proxy_inference"),
    path("hugging_inference", views.hugging_inference, name="hugging_inference"),
]