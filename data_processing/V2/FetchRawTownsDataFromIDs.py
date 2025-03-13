import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# Configuration
X = 100  # Maximum chunks to process
chunk_size = 50  # Number of IDs per request
max_threads = 2  # Matches API rate limit (2 requests per second)
apiUrl = 'https://myhordes.de/api/x/json/towns'

# Get script directory
script_dir = Path(__file__).parent

# Load API keys from config file
config_path = script_dir / 'config.json'
try:
    with config_path.open() as config_file:
        config = json.load(config_file)
        appKey = config['appKey']
        userKey = config['userKey']
        if not appKey or not userKey:
            raise ValueError("Missing 'appKey' or 'userKey' in config file.")
except (FileNotFoundError, json.JSONDecodeError, ValueError) as e:
    print(f"Error loading config.json: {e}")
    exit(1)

# Input town IDs file (modify if needed)
input_json_path = script_dir / '../raw_data/s16_ids.json'

# Generate output filenames based on input file
output_dir = script_dir / '../towns/'
processed_towns_dir = script_dir / '../raw_data/'  # Store processed IDs here
output_json_path = output_dir / f"{input_json_path.stem.replace('_ids', '_towns_data')}.json"
processed_towns_file = processed_towns_dir / f"{input_json_path.stem.replace('_ids', '_processed_towns')}.json"
log_file_path = script_dir / 'api_requests_log.txt'

# Ensure output directories exist
output_dir.mkdir(parents=True, exist_ok=True)
processed_towns_dir.mkdir(parents=True, exist_ok=True)

# Load town IDs
try:
    with input_json_path.open() as f:
        town_ids = json.load(f).get('towns', [])
except (FileNotFoundError, json.JSONDecodeError) as e:
    print(f"Error loading town IDs file: {e}")
    exit(1)

# Load processed town IDs
processed_towns = set()
if processed_towns_file.exists():
    try:
        with processed_towns_file.open() as f:
            processed_towns = set(json.load(f))
    except json.JSONDecodeError:
        processed_towns = set()

# Filter out already processed towns
town_ids_to_process = [tid for tid in town_ids if tid not in processed_towns]

# Load existing output data
if output_json_path.exists():
    try:
        with output_json_path.open() as f:
            all_data = json.load(f)
    except json.JSONDecodeError:
        all_data = []
else:
    all_data = []

# Prepare the fields parameter
arg2info = 'id, mapId, day, mapName, language, season, phase, v1, score, citizens.fields(id, twinId, etwinId, survival, avatar, avatarData.fields(url, format, x, y, classic, compressed), name, dtype, score, msg, comment)'

# Function to fetch data from API
def fetch_town_data(ids_chunk):
    url = f"{apiUrl}?appkey={appKey}&userkey={userKey}&ids={','.join(map(str, ids_chunk))}&fields={arg2info}"
    response = requests.get(url)

    # Log the API request
    with log_file_path.open('a') as log_file:
        log_file.write(f"API Request to: {url}\n")
        log_file.write("Response Headers:\n")
        for key, value in response.headers.items():
            log_file.write(f"{key}: {value}\n")
        log_file.write("\n---\n")

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error {response.status_code} for chunk: {ids_chunk}")
        return []

# Process in parallel
total_ids = len(town_ids_to_process)
chunks = [town_ids_to_process[i:i + chunk_size] for i in range(0, min(total_ids, X * chunk_size), chunk_size)]

with ThreadPoolExecutor(max_workers=max_threads) as executor:
    futures = {executor.submit(fetch_town_data, chunk): chunk for chunk in chunks}

    for future in as_completed(futures):
        data = future.result()
        if data:
            all_data.extend(data)
            processed_towns.update(item['id'] for item in data)

            # Save updated data
            with output_json_path.open('w') as f:
                json.dump(all_data, f, indent=4)
            with processed_towns_file.open('w') as f:
                json.dump(list(processed_towns), f, indent=4)

print(f"Data successfully written to {output_json_path}")
