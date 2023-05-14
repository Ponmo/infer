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
import re

from django.http import JsonResponse
import requests
from requests.exceptions import HTTPError
from huggingface_hub.inference_api import InferenceApi
from pymongo.mongo_client import MongoClient
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie


MONGO_URI = "mongodb+srv://second:" + os.environ.get('MONGO_PASSWORD') + "@mycluster.pgus5.mongodb.net/?retryWrites=true&w=majority"
MONGO_CLIENT = MongoClient(MONGO_URI)
MONGO_DB = MONGO_CLIENT.Infer
registered_apis = MONGO_DB.RegisteredAPIs

options = {'fill_mask': ['gpt2'], #fill mask is weird because each one has a different mask token format.
           'text_classification': ['distilbert-base-uncased-finetuned-sst-2-english', 'cardiffnlp/twitter-roberta-base-sentiment-latest', 'madhurjindal/autonlp-Gibberish-Detector-492513457'],
           'image_to_text_description': ['nlpconnect/vit-gpt2-image-captioning', 'Salesforce/blip-image-captioning-base', 'Salesforce/blip-image-captioning-large'],
           'image_to_text_transcribe': ['microsoft/trocr-base-printed', 'microsoft/trocr-small-handwritten', 'microsoft/trocr-large-handwritten', 'kha-white/manga-ocr-base'],
           'object_detection': ['hustvl/yolos-tiny', 'hustvl/yolos-small', 'microsoft/table-transformer-detection', 'microsoft/table-transformer-structure-recognition', 'valentinafeve/yolos-fashionpedia'],
           'video_to_text_transcribe': ['assembly-ai']}

valid_url = re.compile( # Only a little buggy
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)

HUGGING_API_URL_BASE = "https://api-inference.huggingface.co/models/"
HUGGING_API_HEADERS = {"Authorization": f"Bearer {os.environ.get('HUGGING_TOKEN')}"}
ASSEMBLY_TOKEN = os.environ.get('ASSEMBLY_TOKEN')
ASSEMBLY_TRANSCRIPT_ENDPOINT = "https://api.assemblyai.com/v2/transcript"

@cache_page(60 * 24)
@ensure_csrf_cookie()
def home(request):
    return render(request, 'api/home.html')

@cache_page(60 * 24)
@ensure_csrf_cookie()
def upload(request):
    return render(request, 'api/upload.html')

@api_view(['POST'])
# @csrf_exempt #temporarily
def register_api(request):
    if registered_apis.count_documents({'url': request.data['url']}, limit = 1) > 0:
        return JsonResponse({"error": "Already registered"}, safe=False, status=status.HTTP_406_NOT_ACCEPTABLE)

    if re.match(valid_url, request.data['url']) is not None:

        try:
            data = requests.post(request.data['url'], data={'inputs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/640px-Hamburger_%28black_bg%29.jpg'})
        except HTTPError as e:
            try:
                data = requests.post(request.data['url'], data={'inputs': 'I fell in love with the world right when I was [MASK] <MASK> (MASK)'})
            except HTTPError as e:
                return JsonResponse({"error": "Test requests failed"}, safe=False, status=status.HTTP_406_NOT_ACCEPTABLE)

        registered_apis.insert_one({'url': request.data['url']})

        return JsonResponse({"message": "Registered!"}, safe=False, status=status.HTTP_202_ACCEPTED)
    return JsonResponse({"error": "Invalid URL"}, safe=False, status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(['POST'])
def inference(request):

    # Check how much memory is being used by a process, and unload old models from memory if necessary.
    process = psutil.Process()
    print(process.memory_info().rss) #in bytes

@csrf_exempt #temporarily
@api_view(['POST'])
def proxy_inference(request):


    cached = cache.get(str(request.data))
    if cached:
        return JsonResponse(cached, safe=False, status=status.HTTP_200_OK)

    # dont cache custom or community in production, they might want to change the model for testing

    model = request.data['model']
    custom_model = request.data['custom_model']
    data_type = request.data['data_type']
    data = ''

    if custom_model:
        try:
            if (re.match(valid_url, custom_model) is not None):
                data = requests.post(custom_model, data={'inputs': request.data['content']})
                cache.set(str(request.data), data.text)
                return JsonResponse(data.text, safe=False, status=status.HTTP_200_OK)
        except Exception:
            return JsonResponse({"error": "Custom model did not work..."}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({"error": "Custom model is not a valid link..."}, safe=False, status=status.HTTP_400_BAD_REQUEST)

    if model.startswith('http'):
        try:
            data = requests.post(model, data={'inputs': request.data['content']})
            cache.set(str(request.data), data.text)
            return JsonResponse(data.text, safe=False, status=status.HTTP_200_OK)
        except Exception:
            registered_apis.delete_one({'url': model})
            return JsonResponse({"error": "Community model did not work, removing..."}, safe=False, status=status.HTTP_400_BAD_REQUEST)

    if data_type == 'video':
        try:
            data = {"transcription": transcribe_video(request.data['content'])}
            cache.set(str(request.data), data)
            return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
        except HTTPError as e:
            return JsonResponse({"error": e.response.text}, safe=False, status=status.HTTP_400_BAD_REQUEST)

    if data_type == 'text':
        data = {"inputs": request.data['content']}

    if data_type == 'image':
        if len(request.data['content']) > 200:
            return JsonResponse({"error": "Image too large (base64?)"}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        data = {"inputs": request.data['content']}

    response = None

    if model:
        HUGGING_API_URL = HUGGING_API_URL_BASE + model
        try:
            if model in options['fill_mask']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
            elif model in options['text_classification']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data)
            elif model in options['image_to_text_description']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
            elif model in options['image_to_text_transcribe']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
            elif model in options['object_detection']:
                response = requests.request("POST", HUGGING_API_URL, headers=HUGGING_API_HEADERS, data=data['inputs'])
        except HTTPError as e:
            return JsonResponse({"error": e.response.text}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        
    elif custom_model:
        try:
            response = requests.request("POST", custom_model, data = data['inputs'])
        except HTTPError as e:
            return JsonResponse({"error": e.response.text}, safe=False, status=status.HTTP_400_BAD_REQUEST)
        
    if ("error" not in json.loads(response.text)):
        print('cached')
        cache.set(str(request.data), json.loads(response.content.decode("utf-8")))

    return JsonResponse(json.loads(response.content.decode("utf-8")), safe=False, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_options(request):
    # allow user to do their own huggingface name / their own api
    # Register their app with CORS ALLOWED ORIGINS our domain....
    # If a community doesn't work (because they removed it or whatever), delete from MongoDB
    # ALlow them to give names to it. which is passed to the front and then u know search the names back up if the dataType is custom
    # rank by most popular?
    community = []
    for document in registered_apis.find().limit(200): #needs lazy loading
        community.append(document['url'])
    print(community)
    # ({'url': request.data['url']})

    data = {
        'fill_mask': ' '.join(options['fill_mask']),
        'text_classification': ' '.join(options['text_classification']),
        'image_to_text_description': ' '.join(options['image_to_text_description']),
        'image_to_text_transcribe': ' '.join(options['image_to_text_transcribe']),
        'object_detection': ' '.join(options['object_detection']),
        'video_to_text_transcribe': ' '.join(options['video_to_text_transcribe']),
        'community': ' '.join(community),
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
    

def transcribe_video(url):

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