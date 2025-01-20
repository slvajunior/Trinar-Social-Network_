import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta
import pymysql

pymysql.install_as_MySQLdb()
load_dotenv()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/


LOGIN_REDIRECT_URL = 'two_factor:profile'
LOGOUT_REDIRECT_URL = "/users/login/"
LOGIN_URL = "/users/login/"
LOGOUT_URL = "/users/logout/"

# Hosts permitidos
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'http://localhost:5173']

# Configuração do email (para links de redefinição de senha)
EMAIL_PAGE_DOMAIN = "http://localhost:5173"

# Configurações de CSRF
CSRF_COOKIE_SECURE = False
CSRF_COOKIE_NAME = "csrftoken"
CSRF_COOKIE_HTTPONLY = False
CSRF_TRUSTED_ORIGINS = ['http://localhost:5173']
CSRF_HEADER_NAME = "HTTP_X_CSRFTOKEN"

# CORS (para permitir que o frontend acesse a API)
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]

# Para permitir que cookies sejam enviados entre frontend e backend
CORS_ALLOW_CREDENTIALS = True


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework_simplejwt.token_blacklist",
    "rest_framework",
    'rest_framework.authtoken',
    "django_email_verification",
    "drf_spectacular",
    "corsheaders",
    "drf_yasg",
    "django_otp",
    "django_otp.plugins.otp_totp",
    "two_factor",
    "users",
    "core",
]

# AUTH_USER_MODEL = 'core.User'
AUTH_USER_MODEL = 'users.User'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Endereço do frontend
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
]

ROOT_URLCONF = "trinar_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, 'templates')],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "trinar_backend.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG") == "True"

DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_OPTIONS = eval(os.getenv("DATABASE_OPTIONS", "{}"))

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": DATABASE_NAME,
        "USER": DATABASE_USER,
        "PASSWORD": DATABASE_PASSWORD,
        "HOST": DATABASE_HOST,
        "PORT": DATABASE_PORT,
        "OPTIONS": DATABASE_OPTIONS,
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        'OPTIONS': {'min_length': 8},
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "pt-br"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "/static/"

STATICFILES_DIRS = [BASE_DIR / "static"]

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

MEDIA_URL = "/media/"

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Para desenvolvimento local (mostra no console)

EMAIL_BACKEND = os.getenv("EMAIL_BACKEND")

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS") == "True"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

SITE_DOMAIN = os.getenv("SITE_DOMAIN")
SITE_NAME = os.getenv("SITE_NAME")


# Configurações do django-email-verification
def verified_callback(user):
    user.is_active = True
    user.save()


EMAIL_VERIFIED_CALLBACK = verified_callback

# Configurações específicas para django_email_verification
EMAIL_FROM_ADDRESS = os.getenv('EMAIL_FROM_ADDRESS', 'seuemail@gmail.com')
EMAIL_PAGE_DOMAIN = os.getenv('EMAIL_PAGE_DOMAIN', 'http://localhost:5173')
EMAIL_MAIL_SUBJECT = os.getenv('EMAIL_MAIL_SUBJECT', 'Confirme seu email')
EMAIL_MAIL_PLAIN = os.getenv('EMAIL_MAIL_PLAIN', 'mail_body.txt')
EMAIL_MAIL_HTML = os.getenv('EMAIL_MAIL_HTML', 'mail_body.html')
EMAIL_MAIL_TOKEN_LIFE = int(os.getenv('EMAIL_MAIL_TOKEN_LIFE', 3600))
EMAIL_MAIL_PAGE_TEMPLATE = os.getenv('EMAIL_MAIL_PAGE_TEMPLATE', 'email_confirmation.html')

DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'Trinar <juniorazevedosilva43@gmail.com>')
