from itsdangerous import URLSafeTimedSerializer
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.html import strip_tags
from dotenv import load_dotenv
import os

load_dotenv()

# Defina uma chave secreta para gerar tokens
SECRET_KEY = os.getenv("SECRET_KEY")

salt = "email-confirmation"  # Um salt para aumentar a segurança

# Crie um serializer para gerar e validar tokens
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
    # Gere o token de confirmação
    token = generate_confirmation_token(user.email)  # Gera o token com base no email

    # Defina o link de confirmação manualmente (apenas o token)
    domain = 'http://127.0.0.1:8000'  # Use o domínio do backend
    confirmation_link = f"{domain}/confirm-email/{token}/"  # Apenas o token na URL

    print(f"Link de confirmação: {confirmation_link}")  # Adicione este log

    # Renderize o template de email
    context = {
        'user': user,
        'link': confirmation_link,  # Passa o link correto para o template
    }
    email_body = render_to_string('mail_body.html', context)

    # Envie o email
    send_mail(
        subject='Confirme seu email',
        message=strip_tags(email_body),  # Versão em texto simples
        from_email='Trinar <juniorazevedosilva43@gmail.com>',
        recipient_list=[user.email],
        html_message=email_body,  # Versão em HTML
    )
