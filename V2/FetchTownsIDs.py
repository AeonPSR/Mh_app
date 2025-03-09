import json
import requests
from pathlib import Path

# ==== CONFIGURATION (Modify these values) ====
SEASON = '16'  # 'a' for alpha, 'b' for beta, or a season number
LANGUAGE = None  # 'de', 'fr', 'es', 'en', 'multi', or None for no filter
API_URL = "https://myhordes.de/api/x/json/townlist"
OUTPUT_DIR = Path(__file__).parent / "../raw_data/"

# Load API keys from config.json
config_path = Path(__file__).parent / 'config.json'
try:
    with config_path.open() as config_file:
        config = json.load(config_file)
        appKey = config.get('appKey')
        userKey = config.get('userKey')
        if not appKey or not userKey:
            raise ValueError("Missing 'appKey' or 'userKey' in config file.")
except (FileNotFoundError, json.JSONDecodeError, ValueError) as e:
    print(f"Error loading config.json: {e}")
    exit(1)

# Ensure the output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Construct API request parameters
params = {
    "appkey": appKey,
    "userkey": userKey,
    "season": SEASON
}
if LANGUAGE:
    params["language"] = LANGUAGE

# Make the API request
response = requests.get(API_URL, params=params)

# Handle response
if response.status_code == 200:
    data = response.json()
    output_path = OUTPUT_DIR / f"{SEASON}_ids.json"

    # Save data to JSON
    with output_path.open("w") as f:
        json.dump(data, f, indent=4)

    print(f"Saved town IDs to {output_path}")
else:
    print(f"Error: API request failed with status code {response.status_code}")
