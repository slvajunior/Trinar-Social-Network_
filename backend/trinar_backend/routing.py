# trinar_backend/routing.py
from django.urls import path
from trinar_backend.consumers import TimelineConsumer

application = [
    path("ws/timeline/", TimelineConsumer.as_asgi()),  # Chama o consumidor diretamente aqui
]
