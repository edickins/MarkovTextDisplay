const MarkovChain = require('markov-chain-nlg');
const MarkovGen = require('markov-generator');

const fs = require('fs');
const path = require('path');

class MarkovTextGenerator {
  constructor(folderNames) {
    this.trainingComplete = false;
    this.MAX_TEXT_LENGTH = 160;
    this.DEFAULT_TEXT_LENGTH = 80;
    this.folderNames = folderNames;
  }

  // use all files in the folderNames list to train the MarkovText
  async init() {
    // store all Promises returned from MarkovText.trainTxt()
    const trainingPromises = [];

    for (const folderName of this.folderNames) {
      const dataFolder = path.join(__dirname, '..', 'data', 'text');
      const folderPath = path.join(dataFolder, folderName);
      const folderFiles = this._readFilesFromFolder(folderPath);

      trainingPromises.push(
        ...folderFiles.map(file =>
          MarkovChain.trainTxt(path.join(folderPath, file), '\n')
        )
      );

      if (folderFiles.length > 0) {
        const fileContents = fs.readFileSync(
          path.join(folderPath, folderFiles[0]),
          'utf-8'
        );

        let markov = new MarkovGen({
          input: fileContents.split('\n'),
          minLength: 15
        });

        let sentence = markov.makeChain();
        console.log(this.folderNames, sentence);
      }
    }

    // resolve all the Promises
    Promise.all(trainingPromises)
      .then(() => (this.trainingComplete = true))
      .catch(error => {
        throw error;
      });
  }

  // Function to read files from a folder
  _readFilesFromFolder(folderPath) {
    return fs.readdirSync(folderPath);
  }

  // Function to select a random file from an array
  _getRandomFile(filesArray) {
    const randomIndex = Math.floor(Math.random() * filesArray.length);
    return filesArray[randomIndex];
  }

  // return an Object with a text generated from the MarkovText
  async getText() {
    if (!this.trainingComplete) {
      await this.init();
    }
    const text = this._getTextToLength(this.MAX_TEXT_LENGTH);
    return { data: text };
  }

  // generate and clean text
  _generateMarkovText(maxLength) {
    maxLength =
      maxLength && !isNaN(maxLength) ? maxLength : this.DEFAULT_TEXT_LENGTH;
    let text = MarkovChain.generate(maxLength);
    text = this._cleanText(text);
    return text;
  }

  // remove unwanted content from text
  _cleanText(text) {
    let txt = String(text);
    txt = txt.replace(/\n/, '');
    return txt;
  }

  // keep adding text until MAX_TEXT_LENGTH is reached
  _maximiseTextLength(text) {
    let maxCycles = 5;
    let currentCycle = 0;
    while (text.length <= this.MAX_TEXT_LENGTH && currentCycle < maxCycles) {
      let newText = MarkovChain.generate(100);
      text = this._joinTexts(text, newText);
      currentCycle++;
    }
    return text;
  }

  _getTextToLength(textLength) {
    let text = this._generateMarkovText(textLength);
    text = this._maximiseTextLength(text);
    return text;
  }

  _joinTexts(text, newText) {
    let returnText = text;
    if (returnText.length + newText.length <= this.MAX_TEXT_LENGTH) {
      returnText += newText;
    }
    return returnText;
  }
}

module.exports = MarkovTextGenerator;
