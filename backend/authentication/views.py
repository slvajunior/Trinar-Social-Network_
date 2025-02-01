from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from users.serializers import UserSerializer
from users.utils import send_email_confirmation
import logging


logger = logging.getLogger(__name__)


class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    """
    API View para registrar um novo usuário.
    """

    def post(self, request, *args, **kwargs):
        logger.info("Dados recebidos: %s", request.data)  # Log dos dados recebidos

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(
                "Usuário registrado com sucesso: %s", serializer.data
            )  # Log de sucesso

            # Enviar email de confirmação
            send_email_confirmation(user)
            logger.info("Email de confirmação enviado para: %s", user.email)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error("Erros de validação: %s", serializer.errors)  # Log de erros
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
