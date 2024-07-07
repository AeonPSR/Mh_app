import json
import requests
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Load API keys from config file
with open('config.json') as config_file:
    config = json.load(config_file)
    appKey = config['appKey']
    userKey = config['userKey']

# Set up Google Sheets API credentials
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('path/to/your-credentials.json', scope)
client = gspread.authorize(creds)

# Open the Google Sheet
sheet = client.open("Your Google Sheet Name").sheet1

# Configuration
apiUrl = 'https://myhordes.de/api/x/json/towns'
jsonData = json.load(open('towns_id/townsID.json'))
startArrayIndex = 1
endArrayIndex = 100

# Prepare the fields parameter
arg2info = 'id, mapId, day, mapName, language, season, phase, v1, score, citizens.fields(id, twinId, etwinId, survival, avatar, avatarData.fields(url, format, x, y, classic, compressed), name, dtype, score, msg, comment)'

# Iterate over the specified range of arrays
for i in range(startArrayIndex, endArrayIndex + 1):
    arrayKey = str(i)
    ids = jsonData.get(arrayKey)
    if ids:
        apiUrlWithParams = f"{apiUrl}?appkey={appKey}&userkey={userKey}&ids={','.join(map(str, ids))}&fields={arg2info}"
        response = requests.get(apiUrlWithParams)
        if response.status_code == 200:
            data = response.json()
            # Upload data to Google Sheet
            for item in data:
                row = [
                    item.get('id'),
                    item.get('mapId'),
                    item.get('day'),
                    item.get('mapName'),
                    item.get('language'),
                    item.get('season'),
                    item.get('phase'),
                    item.get('v1'),
                    item.get('score')
                ]
                # Add nested fields if they exist
                if 'citizens' in item:
                    for citizen in item['citizens']:
                        citizen_row = row + [
                            citizen.get('id'),
                            citizen.get('twinId'),
                            citizen.get('etwinId'),
                            citizen.get('survival'),
                            citizen.get('avatar'),
                            citizen.get('avatarData', {}).get('url'),
                            citizen.get('avatarData', {}).get('format'),
                            citizen.get('avatarData', {}).get('x'),
                            citizen.get('avatarData', {}).get('y'),
                            citizen.get('avatarData', {}).get('classic'),
                            citizen.get('avatarData', {}).get('compressed'),
                            citizen.get('name'),
                            citizen.get('dtype'),
                            citizen.get('score'),
                            citizen.get('msg'),
                            citizen.get('comment')
                        ]
                        sheet.append_row(citizen_row)
        else:
            print(f"Failed to fetch data for {arrayKey}: {response.status_code}")

print("Data uploaded to Google Sheet successfully.")
