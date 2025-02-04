# trinar_backend/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class TimelineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "timeline"

        # Conectar-se ao grupo de WebSocket
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remover do grupo de WebSocket
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Enviar a mensagem para o grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'timeline_message',
                'message': message
            }
        )

    async def timeline_message(self, event):
        message = event['message']

        # Enviar a mensagem ao WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
