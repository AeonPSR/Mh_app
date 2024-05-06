const { appKey, userKey } = require('./config');

const https = require('https');
const fs = require('fs');

const apiUrl = 'https://myhordes.de/api/x/json/townlist';
const outputFile = 'beta_ids.json';
//
const arg1 = '&season=';
const arg1info = 'b';
//
//const arg2 = '&fields=';
const arg2 = '';
const arg2info = '';
//
const apiUrlWithParams = `${apiUrl}?appkey=${appKey}&userkey=${userKey}${arg1}${arg1info}${arg2}${arg2info}`;

https.get(apiUrlWithParams, (response) => {
	let data = '';

	response.on('data', (chunk) => {
		data += chunk;
	});

	response.on('end', () => {
		const formattedData = JSON.stringify(JSON.parse(data), null, 2); // Add indentation and line breaks
		fs.writeFile(outputFile, formattedData, (err) => {
		if (err) throw err;
		console.log('Data has been saved to', outputFile);
		console.log(apiUrlWithParams);
		});
	});
}).on('error', (error) => {
	console.error('Error:', error);
});
