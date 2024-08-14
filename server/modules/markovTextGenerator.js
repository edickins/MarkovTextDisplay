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
    this.markovGen = undefined;
  }

  // Function to read files from a folder
  _readFilesFromFolder(folderPath) {
    return fs.readdirSync(folderPath);
  }

  // use all files in the folderNames list to train the global MarkovText
  // instance whilst also returning a
  async init() {
    // store all Promises returned from MarkovText.trainTxt()
    const trainingPromises = [];
    let folderFiles = [];
    let folderFilesAsStrings = [];

    for (const folderName of this.folderNames) {
      const dataFolder = path.join(__dirname, '..', 'data', 'text');
      const folderPath = path.join(dataFolder, folderName);
      folderFiles = this._readFilesFromFolder(folderPath);

      trainingPromises.push(
        ...folderFiles.map(file =>
          MarkovChain.trainTxt(path.join(folderPath, file), '\n')
        )
      );

      folderFilesAsStrings.push(
        ...folderFiles.map(filePath =>
          fs.readFileSync(path.join(folderPath, filePath), 'utf-8')
        )
      );
    }

    // resolve all the Promises
    Promise.all(trainingPromises)
      .then(() => (this.trainingComplete = true))
      .catch(error => {
        throw error;
      });

    // new MarkovGen code - this generator has local state
    if (folderFiles.length > 0) {
      // create an array of all the text from all the files in all the folders
      const markovInput = [].concat(
        ...folderFilesAsStrings.map(strings => strings.split('\n'))
      );

      // create a new MarkovGen - minLength values above 15 seem to excede allowed stack limits.
      this.markovGen = new MarkovGen({ input: markovInput, minLength: 6 });
      console.log(this.folderNames);
    }
  }

  replaceTextWithSpace(textInput) {
    const rand = Math.floor(Math.random() * 10);
    if (rand > 9) {
      let dotCount = Math.floor(Math.random() * 20);
      let replacementString = '';
      while (dotCount > 0) {
        replacementString += '.';
        dotCount -= 1;
      }
      textInput = replacementString;
    }
    return textInput;
  }

  // return an Object with text generated from the MarkovText
  async getText(count) {
    if (!this.trainingComplete) {
      await this.init();
    }
    let text = this._generateMarkovText();
    text = this._maximiseTextLength(text, count);
    text = this.replaceTextWithSpace(text);

    const random = Math.random() * 10;
    if (random < 1) {
      text = '';
    }

    return { data: text };
  }

  // generate and clean text
  _generateMarkovText() {
    //let text = MarkovChain.generate(this.DEFAULT_TEXT_LENGTH);
    let text = this.markovGen.makeChain();
    return this._cleanText(text);
    t;
  }

  // keep adding text until MAX_TEXT_LENGTH is reached
  _maximiseTextLength(text, count) {
    let maxCycles = count !== undefined ? count : 5;

    let currentCycle = 0;
    while (text.length < this.MAX_TEXT_LENGTH && currentCycle < maxCycles) {
      let newText = ' ' + this._generateMarkovText();
      text = this._joinTexts(text, newText);
      currentCycle++;
    }
    return text;
  }

  // remove unwanted content from text
  _cleanText(text) {
    let txt = String(text);
    txt = txt.replace(/\n/, '');
    return txt;
  }

  // add two text strings together without exceding MAX allowed length
  _joinTexts(text, newText) {
    let returnText = text;
    if (returnText.length + newText.length <= this.MAX_TEXT_LENGTH) {
      returnText += newText;
    }
    return returnText;
  }
}

module.exports = MarkovTextGenerator;
