const { appKey, userKey } = require('./config');
const https = require('https');
const fs = require('fs');

const apiUrl = 'https://myhordes.de/api/x/json/towns';
const outputFile = 'player_interactions.json';
const arg2 = '&fields=citizens.ids';

// Read the JSON file containing arrays of IDs
const jsonData = require('./towns_id/townsID.json');

// Object to store player interactions
let playerInteractions = {};

jsonData.forEach((town) => {
	town.forEach((id) => {
		const arg1info = id.toString();
		const apiUrlWithParams = `${apiUrl}?appkey=${appKey}&userkey=${userKey}&ids=${arg1info}${arg2}`;

		https.get(apiUrlWithParams, (response) => {
		let data = '';

		response.on('data', (chunk) => {
			data += chunk;
		});

		response.on('end', () => {
			const responseData = JSON.parse(data);

			// Extract player IDs from the response
			const playerIds = responseData.citizens.ids;

			// Update player interactions count
			updatePlayerInteractions(playerIds);

			// Write player interactions to file
			fs.writeFile(outputFile, JSON.stringify(playerInteractions, null, 2), (err) => {
			if (err) throw err;
			console.log('Player interactions data has been saved to', outputFile);
			});
		});
		}).on('error', (error) => {
		console.error('Error:', error);
		});
	});
});

// Function to update player interactions count
function updatePlayerInteractions(playerIds) {
	for (let i = 0; i < playerIds.length; i++) {
		for (let j = i + 1; j < playerIds.length; j++) {
		const player1 = playerIds[i];
		const player2 = playerIds[j];

		// Increment interaction count for player pair
		playerInteractions[`${player1}-${player2}`] = (playerInteractions[`${player1}-${player2}`] || 0) + 1;
		playerInteractions[`${player2}-${player1}`] = (playerInteractions[`${player2}-${player1}`] || 0) + 1;
		}
	}
}
