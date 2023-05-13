from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from django.template import loader
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
# import re, string
# from django.conf import settings
import os
import json
# from enum import Enum
from django.http import JsonResponse
import requests

API_URL_BASE = "https://api-inference.huggingface.co/models/"
headers = {"Authorization": f"Bearer {os.environ.get('HUGGING_TOKEN')}"}

def index(request):
    response = requests.request("POST", API_URL_BASE, headers=headers, data={"inputs": "Can you please let us know more details about your ",})
    return HttpResponse(str(json.loads(response.content.decode("utf-8"))))

@api_view(['GET'])
def get_inference_options(request):
    return JsonResponse({'hi': 1}, safe=False, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
def proxy_inference(request):
    return JsonResponse({'hi': 1}, safe=False, status=status.HTTP_200_OK)

@api_view(['POST', 'GET']) #GET for now...
def hugging_inference(request):
    return JsonResponse({'hi': 1}, safe=False, status=status.HTTP_200_OK)

def get_video_transcript():
    return "string"