import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['sala_nome']
        self.room_group_name = f'chat_{self.room_name}'

        # Adiciona o usuário ao grupo de sala
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove o usuário do grupo de sala
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        post = text_data_json['post']  # Recebe o post

        # Envia o post para o grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_post',  # Método que será chamado
                'post': post          # Dados do post
            }
        )

    async def chat_post(self, event):
        post = event['post']  # Extrai o post do evento

        # Envia o post para o WebSocket
        await self.send(text_data=json.dumps({
            'post': post
        }))
