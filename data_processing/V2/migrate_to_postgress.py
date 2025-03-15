import os
import json
import psycopg2

# PostgreSQL connection config
DB_NAME = "mh_player_graph"
DB_USER = "mh_user"
DB_PASSWORD = "yourpassword"
DB_HOST = "localhost"
DB_PORT = "5432"

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
)
cursor = conn.cursor()

# Ensure tables exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS player_links (
    id SERIAL PRIMARY KEY,
    player1_id INT REFERENCES players(id) ON DELETE CASCADE,
    player2_id INT REFERENCES players(id) ON DELETE CASCADE,
    season TEXT NOT NULL
);
""")

conn.commit()

# Path to player_graphs folder
graphs_dir = "/home/kali/Desktop/Mh_app/data_processing/player_graphs/"
print("Checking directory:", graphs_dir)
print("Files found:", os.listdir(graphs_dir))

# Process each JSON file
for file_name in os.listdir(graphs_dir):
    if file_name.endswith("_graph.json"):
        season = file_name.replace("_graph.json", "")

        with open(os.path.join(graphs_dir, file_name), "r", encoding="utf-8") as f:
            data = json.load(f)

        nodes = {player["id"]: player for player in data["nodes"]}
        links = data["links"]

        # Insert players
        for player_id, player in nodes.items():
            cursor.execute(
                "INSERT INTO players (id, name, avatar) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING",
                (player_id, player.get("name"), player.get("avatar"))
            )

        # Insert links
        for link in links:
            cursor.execute(
                "INSERT INTO player_links (player1_id, player2_id, season) VALUES (%s, %s, %s)",
                (link["source"], link["target"], season)
            )

        conn.commit()
        print(f"✔ Successfully imported season {season}")

cursor.close()
conn.close()
print("🚀 Data migration completed!")
