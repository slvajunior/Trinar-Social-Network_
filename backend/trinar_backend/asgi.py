# trinar_backend/asgi.py
import os
from django.urls import path
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from trinar_backend.routing import application  # Isso importa o roteamento de "trinar_backend.routing"

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trinar_backend.settings")

# Define o roteamento de protocolos (HTTP e WebSocket)
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            # A URL de WebSocket é configurada aqui
            path("ws/timeline/", application),  # A referência ao consumidor correto
        ])
    ),
})
