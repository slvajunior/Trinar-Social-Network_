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
    db=os.getenv("DATABASE_NAME"),
)

# Criação de um cursor para executar consultas
cursor = db.cursor()

try:
    # Execute uma consulta para listar tabelas
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    print("Tabelas disponíveis no banco:")
    for table in tables:
        print(f"\nTabela: {table[0]}")

        # Consultar as primeiras 5 linhas da tabela
        cursor.execute(f"SELECT * FROM {table[0]} LIMIT 20")
        rows = cursor.fetchall()

        # Recuperar os nomes das colunas
        column_names = [desc[0] for desc in cursor.description]

        # Exibir os resultados
        print(" | ".join(column_names))
        for row in rows:
            print(" | ".join(str(item) for item in row))

except MySQLdb.Error as e:
    print(f"Erro ao interagir com o banco de dados: {e}")
finally:
    # Feche a conexão após o uso
    cursor.close()
    db.close()
