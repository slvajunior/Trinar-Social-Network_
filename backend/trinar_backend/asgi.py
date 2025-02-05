# trinar_backend/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from trinar_backend.routing import application  # Isso importa o roteamento do arquivo routing.py

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trinar_backend.settings")

# Definir o roteamento para WebSocket
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(application)  # A URLRouter agora usa a variável `application` de routing.py
    ),
})
