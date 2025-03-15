import json
import os

# Paths
towns_dir = "/home/kali/Desktop/Mh_app/data_processing/towns/"
output_dir = "/home/kali/Desktop/Mh_app/data_processing/player_graphs/"

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Process each season separately
for file_name in os.listdir(towns_dir):
    if file_name.endswith("_towns_data.json"):
        season = file_name.replace("_towns_data.json", "")  # Extract season name
        season_path = os.path.join(towns_dir, file_name)
        output_file = os.path.join(output_dir, f"{season}_graph.json")

        nodes = {}
        links = []

        with open(season_path, "r", encoding="utf-8") as f:
            towns = json.load(f)

        for town in towns:
            citizens = town["citizens"]

            # Add players to nodes
            for player in citizens:
                if player["id"] not in nodes:
                    nodes[player["id"]] = {
                        "id": player["id"],
                        "name": player["name"],
                        "avatar": player["avatar"],
                    }

            # Create links between players in the same town
            for i in range(len(citizens)):
                for j in range(i + 1, len(citizens)):
                    links.append({
                        "source": citizens[i]["id"],
                        "target": citizens[j]["id"],
                        "town": town["mapName"]
                    })

        # Convert nodes dict to a list
        graph_data = {
            "season": season,
            "nodes": list(nodes.values()),
            "links": links
        }

        # Save season graph
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(graph_data, f, indent=2)

        print(f"Graph for season '{season}' saved to {output_file}")
