from itsdangerous import URLSafeTimedSerializer, BadData
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.html import strip_tags
from dotenv import load_dotenv
from django.conf import settings
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

salt = "email-confirmation"

serializer = URLSafeTimedSerializer(SECRET_KEY, salt=salt)


def generate_confirmation_token(email):
    """
    Gera um token de confirmação para o email fornecido.
    """
    token = serializer.dumps(email)
    print(f"Token gerado: {token}")
    return token


def confirm_token(token, max_age=3600):
    """
    Valida o token e retorna o email associado.
    `max_age` define o tempo de expiração do token em segundos (padrão: 1 hora).
    """
    try:
        email = serializer.loads(token, max_age=max_age)
        return email
    except Exception:
        return None


def send_email_confirmation(user):
    token = generate_confirmation_token(user.email)

    domain = 'http://127.0.0.1:8000'
    confirmation_link = f"{domain}/confirm-email/{token}/"

    print(f"Link de confirmação: {confirmation_link}")

    context = {
        'user': user,
        'link': confirmation_link,
        'site_name': 'Trinar',
    }
    email_body = render_to_string('mail_body.html', context)

    send_mail(
        subject='Confirme seu email',
        message=strip_tags(email_body),
        from_email='Trinar <juniorazevedosilva43@gmail.com>',
        recipient_list=[user.email],
        html_message=email_body,
    )


def decode_confirmation_token(token, max_age=3600):
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    try:
        return serializer.loads(token, salt='email-confirmation-salt', max_age=max_age)
    except BadData:
        return None
