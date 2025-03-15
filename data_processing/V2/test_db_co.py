import psycopg2

DB_NAME = "mh_player_graph"
DB_USER = "mh_user"
DB_PASSWORD = "yourpassword"  # Ensure this is correct
DB_HOST = "localhost"
DB_PORT = "5432"

try:
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
    )
    print("✅ Connection successful!")
    conn.close()
except Exception as e:
    print("❌ Connection failed:", e)
