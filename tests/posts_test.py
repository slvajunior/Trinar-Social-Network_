import requests
import json

url = "http://127.0.0.1:8000/api/posts/"
headers = {
    "Content-Type": "application/json"
}

data = {
    "text": "Meu primeiro post",
    "hashtags": ["test"],  # Agora 'hashtags' é uma lista de strings
    "mentions": [],  # Agora 'mentions' é uma lista vazia
    "visibility": "public",
    "additional_text": ""
}

response = requests.post(url, headers=headers, data=json.dumps(data))

# Verificando o código de status
print(response.status_code)

# Verificando o corpo da resposta em texto
print(response.text)

# Tentando acessar o JSON
try:
    print(response.json())
except ValueError:
    print("Resposta não é JSON ou está vazia.")
