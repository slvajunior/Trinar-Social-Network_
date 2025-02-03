# test de envio de email para recuperação de senhas
from django.core.mail import send_mail

send_mail(
    'Assunto do Email',
    'Aqui vai o corpo do email. Isso mostra que o envio de Email está ok.',
    'your-email@gmail.com',
    ['svajunior8@gmail.com'],
    fail_silently=False,
)
