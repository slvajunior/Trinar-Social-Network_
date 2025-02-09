from django.urls import re_path
from trinar_backend.consumers import ChatConsumer  # Ajuste para o nome do seu app

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<sala_nome>\w+)/$", ChatConsumer.as_asgi()),
]
