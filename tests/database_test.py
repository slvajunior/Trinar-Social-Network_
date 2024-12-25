import MySQLdb
from dotenv import load_dotenv
import os

# Carregar variáveis do arquivo .env
load_dotenv()

# Configure os detalhes da conexão usando as variáveis do .env
db = MySQLdb.connect(
    host=os.getenv("DATABASE_HOST"),
    user=os.getenv("DATABASE_USER"),
    passwd=os.getenv("DATABASE_PASSWORD"),
    db=os.getenv("DATABASE_NAME")
)

# Criação de um cursor para executar consultas
cursor = db.cursor()

# Execute uma consulta (Exemplo: listar tabelas)
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

print("Tabelas disponíveis no banco:")
for table in tables:
    print(table[0])

# Feche a conexão após o uso
cursor.close()
db.close()
