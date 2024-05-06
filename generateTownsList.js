const fs = require('fs');
const path = require('path');

const folderPath = 'towns_id/.'; // Replace 'folder_path_here' with the path to your folder
const files = fs.readdirSync(folderPath);

const maxValues = 50;
let currentValues = 0;
let currentArray = [];
let currentIndex = 1; // Index for the current array in the output JSON file
const outputData = {}; // Object to store the output data

for (const file of files) {
const filePath = path.join(folderPath, file);
const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

for (const town of content.towns) {
	if (currentValues < maxValues) {
	currentArray.push(town);
	currentValues++;
	} else {
	outputData[currentIndex.toString()] = currentArray;
	currentIndex++;
	currentArray = [town];
	currentValues = 1;
	}
}
}

// Add the last array to the output data
outputData[currentIndex.toString()] = currentArray;

// Write the output data to a JSON file
fs.writeFileSync('townsID.json', JSON.stringify(outputData, null, 2));