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
import time
import psutil

from django.http import JsonResponse
import requests
from requests.exceptions import HTTPError
from huggingface_hub.inference_api import InferenceApi
# from django.views.decorators.cache import cache_page
# from django.core.cache import cache


options = {'fill_mask': ['gpt2'], #fill mask is weird because each one has a different mask token format.
           'text_classification': ['distilbert-base-uncased-finetuned-sst-2-english', 'cardiffnlp/twitter-roberta-base-sentiment-latest', 'madhurjindal/autonlp-Gibberish-Detector-492513457'],
           'image_to_text_description': ['nlpconnect/vit-gpt2-image-captioning', 'Salesforce/blip-image-captioning-base', 'Salesforce/blip-image-captioning-large'],
           'image_to_text_transcribe': ['microsoft/trocr-base-printed', 'microsoft/trocr-small-handwritten', 'microsoft/trocr-large-handwritten', 'kha-white/manga-ocr-base'],
           'object_detection': ['hustvl/yolos-tiny', 'hustvl/yolos-small', 'microsoft/table-transformer-detection', 'microsoft/table-transformer-structure-recognition', 'valentinafeve/yolos-fashionpedia'],
           'video_to_text_transcribe': ['assembly-ai']}


HUGGING_API_URL_BASE = "https://api-inference.huggingface.co/models/"
HUGGING_API_HEADERS = {"Authorization": f"Bearer {os.environ.get('HUGGING_TOKEN')}"}
ASSEMBLY_TOKEN = os.environ.get('ASSEMBLY_TOKEN')
ASSEMBLY_TRANSCRIPT_ENDPOINT = "https://api.assemblyai.com/v2/transcript"

# @cache_page(60 * 24)
def home(request):
    return render(request, 'api/home.html')

# @cache_page(60 * 24)
def upload(request):
    return render(request, 'api/upload.html')

@api_view(['POST', 'GET']) #GET for now...
def inference(request):

    # Check how much memory is being used by a process, and unload old models from memory if necessary.
    process = psutil.Process()
    print(process.memory_info().rss) #in bytes

@api_view(['POST', 'GET']) #GET for now...
def proxy_inference(request):


    # cached = cache.get(str(request.data))
    # if cached:
    #     return JsonResponse(cached, safe=False, status=status.HTTP_200_OK)

    data_type = 'image' # data_type = request.data['data_type']
    data = ''

    if data_type == 'video':
        try:
            # data = {"transcription": transcribe_video()}
            data = {"transcription": transcribe_video(request.data['content'])}
            # cache.set(str(request.data), data)
            return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
        except HTTPError as e:
            return JsonResponse({"error": e.response.text}, safe=False, status=status.HTTP_400_BAD_REQUEST)

        # data = {"inputs": transcribe_video(request.data['content'])}

    if data_type == 'text':
        # data = {"inputs": "I hate it when you come home a "} 
        data = {"inputs": request.data['content']}

    if data_type == 'image':
        # data = {"inputs": "https://wordpress-live.heygrillhey.com/wp-content/uploads/2018/05/Smoked-Hamburgers-Feature-500x500.png"}
        data = {"inputs": request.data['content']}

    # hugging_model = request.data['hugging'] #if request.data['hugging'] in options['text_generation'] else "gpt2"
    # proxy = request.data['proxy']

    # hugging_model = "microsoft/table-transformer-structure-recognition"
    hugging_model = request.data['hugging_model']
    # custom_model = "https://blabla.com"
    custom_model = request.data['custom_model']

    response = None

    if hugging_model:
        # inference = InferenceApi(hugging_model)
        HUGGING_API_URL = HUGGING_API_URL_BASE + hugging_model
        try:
            if hugging_model in options['fill_mask']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
            # response = inference(data)
            elif hugging_model in options['text_classification']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data)
            elif hugging_model in options['image_to_text_description']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
            elif hugging_model in options['image_to_text_transcribe']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
            elif hugging_model in options['object_detection']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
        except HTTPError as e:
            return JsonResponse({"error": e.response.text}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        
    elif custom_model:
        try:
            response = requests.request("POST", custom_model, data=data['inputs'])
        except HTTPError as e:
            return JsonResponse({"error": e.response.text}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        
    # cache.set(str(request.data), json.loads(response.content.decode("utf-8")))

    return JsonResponse(json.loads(response.content.decode("utf-8")), safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_options(request):
    # allow user to do their own huggingface name / their own api
    # Register their app with CORS ALLOWED ORIGINS our domain....
    data = {
        'fill_mask': ' '.join(options['fill_mask']),
        'text_classification': ' '.join(options['text_classification']),
        'image_to_text_description': ' '.join(options['image_to_text_description']),
        'image_to_text_transcribe': ' '.join(options['image_to_text_transcribe']),
        'object_detection': ' '.join(options['object_detection']),
        'video_to_text_transcribe': ' '.join(options['video_to_text_transcribe'])
    }
    # 'fill_mask': ['gpt2'], #fill mask is weird because each one has a different mask token format.
    #        'text_classification': ['distilbert-base-uncased-finetuned-sst-2-english', 'cardiffnlp/twitter-roberta-base-sentiment-latest', 'madhurjindal/autonlp-Gibberish-Detector-492513457'],
    #        'image_to_text_description': ['nlpconnect/vit-gpt2-image-captioning', 'Salesforce/blip-image-captioning-base', 'Salesforce/blip-image-captioning-large'],
    #        'image_to_text_transcribe': ['microsoft/trocr-base-printed', 'microsoft/trocr-small-handwritten', 'microsoft/trocr-large-handwritten', 'kha-white/manga-ocr-base'],
    #        'object_detection': ['hustvl/yolos-tiny', 'hustvl/yolos-small', 'microsoft/table-transformer-detection', 'microsoft/table-transformer-structure-recognition', 'valentinafeve/yolos-fashionpedia']}


    response = JsonResponse(data, safe=False, status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    return response
    

def transcribe_video(url='https://video.twimg.com/ext_tw_video/1379732959234826242/pu/vid/576x1082/7KzYeEtZMmYGK6bN.mp4'):

    # Create header with authorization along with content-type
    header = {
        'authorization': ASSEMBLY_TOKEN,
        'content-type': 'application/json'
    }

    upload_url = {'upload_url': url}

    # Request a transcription
    transcript_response = request_transcript(upload_url, header)

    # Create a polling endpoint that will let us check when the transcription is complete
    polling_endpoint = make_polling_endpoint(transcript_response)

    # Wait until the transcription is complete
    wait_for_completion(polling_endpoint, header)

    # Request the paragraphs of the transcript
    paragraphs = get_paragraphs(polling_endpoint, header)

    # Save and print transcript
    # with open('transcript.txt', 'w') as f:
    response = ""
    for para in paragraphs:
        response += para['text'] + '\n'
            # f.write(para['text'] + '\n')

    return response

# Request transcript for file uploaded to AAI servers
def request_transcript(upload_url, header):
    transcript_request = {
        'audio_url': upload_url['upload_url']
    }
    transcript_response = requests.post(
        ASSEMBLY_TRANSCRIPT_ENDPOINT,
        json=transcript_request,
        headers=header
    )
    return transcript_response.json()

# Make a polling endpoint
def make_polling_endpoint(transcript_response):
    polling_endpoint = "https://api.assemblyai.com/v2/transcript/"
    polling_endpoint += transcript_response['id']
    return polling_endpoint

# Wait for the transcript to finish
def wait_for_completion(polling_endpoint, header):
    while True:
        polling_response = requests.get(polling_endpoint, headers=header)
        polling_response = polling_response.json()

        if polling_response['status'] == 'completed':
            break

        time.sleep(5)

# Get the paragraphs of the transcript
def get_paragraphs(polling_endpoint, header):
    paragraphs_response = requests.get(polling_endpoint + "/paragraphs", headers=header)
    paragraphs_response = paragraphs_response.json()

    paragraphs = []
    for para in paragraphs_response['paragraphs']:
        paragraphs.append(para)

    return paragraphs