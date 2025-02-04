# trinar_backend/routing.py
from django.urls import path
from channels.routing import URLRouter
from trinar_backend.consumers import TimelineConsumer  # Certifique-se de que a importação está correta


application = URLRouter([
    path("ws/timeline/", TimelineConsumer.as_asgi()),  # Aqui você chama o consumidor corretamente
])
