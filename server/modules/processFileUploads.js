const fs = require('fs');

const findSentences = data => {
	data = removeLineEndings(data);
	const regex = /([^!\.?]*[\!\.\?])/g;
	return data.match(regex);
};

const removeLineEndings = data => {
	const regex = /\n/g;
	return data.replace(regex, ' ');
};

module.exports = processFileUpload = fileObj => {
	const data = fs.readFileSync(`./uploads/${fileObj.newFilename}`, 'utf-8');
	const sentences = findSentences(data);
	fileObj.sentences = sentences;
	return fileObj;
};
