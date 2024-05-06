const { appKey, userKey } = require('./config');

const https = require('https');
const fs = require('fs');

const apiUrl = 'https://myhordes.de/api/x/json/towns';
const outputFile = 'status.json';
//
const arg1 = '&ids=';
const arg1info = '171411,171579,171604,171725,171726,171776,171777';
//
//const arg2 = '&fields=';
const arg2 = '&fields=';
const arg2info = 'citizens.ids';
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
