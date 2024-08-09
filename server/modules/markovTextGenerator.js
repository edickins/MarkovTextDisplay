const MarkovChain = require('markov-chain-nlg');
const fs = require('fs');
const path = require('path');
const MAX_TEXT_LENGTH = 160;
const DEFAULT_TEXT_LENGTH = 80;

let trainingComplete = false;

function init() {
  // Load files from the "serious" and "fun" folders
  const dataFolder = path.join(__dirname, '..', 'data', 'text');
  const seriousFolder = path.join(dataFolder, 'serious');
  const funFolder = path.join(dataFolder, 'fun');
  const aiFolder = path.join(dataFolder, 'ai');

  // Select random files
  const randomSeriousFile = getRandomFile(readFilesFromFolder(seriousFolder));
  const randomFunFile = getRandomFile(readFilesFromFolder(funFolder));

  console.log(`randomSeriousFile ${randomSeriousFile}`);
  console.log(`randomFunFile ${randomFunFile}`);

  const seriousFiles = readFilesFromFolder(seriousFolder);
  const funFiles = readFilesFromFolder(funFolder);
  const aiFiles = readFilesFromFolder(aiFolder);

  // train the Markov chain with all files in both "serios" and "fun" folders
  const trainingTexts = [
    ...seriousFiles.map(file => {
      return MarkovChain.trainTxt(path.join(seriousFolder, file), '\n');
    }),
    ...funFiles.map(file => {
      return MarkovChain.trainTxt(path.join(funFolder, file), '\n');
    }),
    ...aiFiles.map(file => {
      return MarkovChain.trainTxt(path.join(aiFolder, file), '\n');
    })
  ];

  // train the Markov chain on two random sources
  /* trainingTexts.push(
    MarkovChain.trainTxt(path.join(seriousFolder, randomSeriousFile), '\n')
  );
  trainingTexts.push(
    MarkovChain.trainTxt(path.join(funFolder, randomFunFile), '\n')
  ); */

  Promise.all(trainingTexts).then(() => {
    trainingComplete = true;
  });
}

init();

// Function to read files from a folder
function readFilesFromFolder(folderPath) {
  return fs.readdirSync(folderPath);
}

// Function to select a random file from an array
function getRandomFile(filesArray) {
  const randomIndex = Math.floor(Math.random() * filesArray.length);
  return filesArray[randomIndex];
}

const _getText = async reqQuery => {
  if (!trainingComplete) {
    // Wait for init() to complete before generating text
    await init();
  }
  return { data: _getTextToLength(MAX_TEXT_LENGTH) };
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

let generator = {
  getText: _getText
};
module.exports = generator;
