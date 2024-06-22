const { appKey, userKey } = require('./config');
const fetchData = require('./apiRequest');
const fs = require('fs');

const apiUrl = 'https://myhordes.de/api/x/json/towns';
const outputFile = 'towns.json';
const headerFile = 'header.json';
const jsonData = require('./towns_id/townsID.json');

// Specify the range of arrays you want to iterate over
const startArrayIndex = 1; // Replace with your start index
const endArrayIndex = 100; // Replace with your end index

// Prepare the fields parameter
const arg2info = 'id, mapId, day, mapName, language, season, phase, v1, score, citizens.fields(id, twinId, etwinId, survival, avatar, avatarData.fields(url, format, x, y, classic, compressed), name, dtype, score, msg, comment)';

// Iterate over the specified range of arrays
for (let i = startArrayIndex; i <= endArrayIndex; i++) {
    const arrayKey = i.toString();
    const ids = jsonData[arrayKey];
    if (ids) {
        const apiUrlWithParams = `${apiUrl}?appkey=${appKey}&userkey=${userKey}&ids=${ids.join(',')}&fields=${arg2info}`;
        fetchData(apiUrlWithParams, outputFile, headerFile, 1);
    }
}
