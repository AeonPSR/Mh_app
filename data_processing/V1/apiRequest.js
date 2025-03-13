const https = require('https');
const fs = require('fs');

//0 overwrite the file
//1 appends data to the file
function fetchData(apiUrlWithParams, outputFile, headerFile, appendOrNot) {
    https.get(apiUrlWithParams, (response) => {
        let data = '';

        // Log headers to console and file
        const headers = JSON.stringify(response.headers, null, 2);

        fs.writeFile(headerFile, headers, (err) => {
            if (err) throw err;
            console.log('Headers have been saved to', headerFile);
        });

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const formattedData = JSON.stringify(JSON.parse(data), null, 2); // Add indentation and line breaks
            if (appendOrNot === 1) {
                fs.appendFile(outputFile, formattedData, (err) => {
                    if (err) throw err;
                    console.log('Data has been appended to', outputFile);
                });
            } else {
                fs.writeFile(outputFile, formattedData, (err) => {
                    if (err) throw err;
                    console.log('Data has been written to', outputFile);
                });
            }
            //console.log(apiUrlWithParams);

            // Handle rate limit retry-after
            if (response.headers['x-ratelimit-retry-after']) {
                const retryAfter = new Date(parseInt(response.headers['x-ratelimit-retry-after'], 10) * 1000);
                console.log('Retry after:', retryAfter.toUTCString());
                // Implement retry logic here if needed
            }
        });
    }).on('error', (error) => {
        console.error('Error:', error);
    });
}

module.exports = fetchData;