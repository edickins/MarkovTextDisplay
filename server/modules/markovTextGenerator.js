const MarkovChain = require('markov-chain-nlg');
const MAX_TEXT_LENGTH = 160;
const DEFAULT_TEXT_LENGTH = 80;

const _getText = async reqQuery => {
	let { num = 1 } = reqQuery;
	num = num * 1;
	return new Promise((resolve, reject) => {
		const trainingTexts = [];
		trainingTexts.push(MarkovChain.trainTxt('./data/text/git.txt', '\n'));
		trainingTexts.push(MarkovChain.trainTxt('./data/text/recipes.txt', '\n'));

		Promise.all(trainingTexts).then(() => {
			const returnObj = {};
			returnObj.items = [];

			const texts = [...Array(num)].map(() => {
				return { txt: _getTextToLength(MAX_TEXT_LENGTH) };
			});
			returnObj.data = texts;

			resolve(returnObj);
		});
	});
};

let generator = {
	getText: _getText,
};

function _getTextToLength(textLength) {
	let text = _generateMarkovText(textLength);
	text = _maximiseTextLength(text);
	return text;
}
function _generateMarkovText(maxLength) {
	maxLength = maxLength && !isNaN(maxLength) ? maxLength : DEFAULT_TEXT_LENGTH;
	let text = MarkovChain.generate(maxLength);
	text = cleanText(text);
	return text;
}
function cleanText(text) {
	let txt = String(text);
	txt = txt.replace(/\n/, '');
	return txt;
}
function _maximiseTextLength(text) {
	let maxCycles = 5;
	let currentCycle = 0;
	while (text.length <= MAX_TEXT_LENGTH && currentCycle < maxCycles) {
		let newText = MarkovChain.generate(100);
		text = _joinTexts(text, newText);
		currentCycle++;
	}
	return text;
}
function _joinTexts(text, newText) {
	let returnText = text;
	if (returnText.length + newText.length <= MAX_TEXT_LENGTH) {
		returnText += newText;
	}
	return returnText;
}
module.exports = generator;
