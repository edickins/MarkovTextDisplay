const MarkovTextGenerator = require('../modules/MarkovTextGenerator');
const MarkovChain = require('markov-chain-nlg');

const fsExtra = require('fs-extra');
const formidable = require('formidable');
const connectDB = require('../config/db');
const processFileUploads = require('../modules/processFileUploads');
const MarkovText = require('../models/MarkovText');

const aiInitialStartupText = [
  'I am your digital assistant, bleepbloop v1.0.',
  ' ',
  '[Terminal Boot Sequence Completed]',
  ' ',
  'Welcome to bleebloop v1.0'
];

const systemStatusGenerator = new MarkovTextGenerator(['system_startup']);
systemStatusGenerator.init();

const aiGenerator = new MarkovTextGenerator(['ai']);
aiGenerator.init();

const apologyGenerator = new MarkovTextGenerator(['welcome_messages']);
apologyGenerator.init();

const errorGenerator = new MarkovTextGenerator(['server_errors']);
errorGenerator.init();

const seriousGenerator = new MarkovTextGenerator(['serious']);
seriousGenerator.init();

const funSeriousGenerator = new MarkovTextGenerator(['serious', 'fun']);
funSeriousGenerator.init();

const everythingGenerator = new MarkovTextGenerator([
  'serious',
  'fun',
  'ai',
  'ai',
  'ai'
]);
everythingGenerator.init();

const generators = [
  systemStatusGenerator,
  aiGenerator,
  aiGenerator,
  aiGenerator,
  aiGenerator,
  seriousGenerator,
  funSeriousGenerator,
  everythingGenerator
];

function getRandomGenerator() {
  const generatorIndex = Math.floor(Math.random() * generators.length);
  return generators[generatorIndex];
}

async function fetchTextAndUpdateConfig(
  configObj,
  configObjProperty,
  generator,
  sentenceCount
) {
  console.log(configObjProperty, configObj[configObjProperty]);
  try {
    const result = await generator.getText(sentenceCount);
    const errorResult = await errorGenerator.getText(0);
    return {
      data: { text: result.data, systemErrorText: errorResult.data },
      configObj: {
        ...configObj,
        [configObjProperty]: configObj[configObjProperty] - 1
      }
    };
  } catch (error) {
    console.error('Error fetching from Markov Text generator:', error);
    throw new Error('Text generation failed'); // Throw an error directly
  }
}

async function generateTextFromConfigObj(configObj) {
  if (configObj) {
    // AI boot process message text
    if (configObj.aiSystemStatusRequestCount > 0) {
      try {
        const result = await fetchTextAndUpdateConfig(
          configObj,
          'aiSystemStatusRequestCount',
          systemStatusGenerator,
          0
        );
        return result;
      } catch (error) {
        console.error('Error fetching from Markov Text generator:', error);
        throw new Error('Text generation failed'); // Throw an error directly
      }
    }

    configObj.isInitialised = true;

    // AI boot process message text
    if (configObj.aiInitialStartupRequestCount > 0) {
      try {
        const systemErrorText = await errorGenerator.getText(0);
        return {
          data: {
            text: aiInitialStartupText[configObj.aiInitialStartupRequestCount],
            systemErrorText
          },
          configObj: {
            ...configObj,
            aiInitialStartupRequestCount:
              configObj.aiInitialStartupRequestCount - 1
          }
        };
      } catch (error) {
        console.error('Error fetching from Markov Text generator:', error);
        throw new Error('Text generation failed'); // Throw an error directly
      }
    }

    // inform user of system status from the systemStartupGenerator
    if (configObj.aiApologyRequestCount > 0) {
      try {
        const result = await fetchTextAndUpdateConfig(
          configObj,
          'aiApologyRequestCount',
          apologyGenerator,
          0
        );
        return result;
      } catch (error) {
        console.error('Error fetching from Markov Text generator:', error);
        throw new Error('Text generation failed'); // Throw an error directly
      }
    }

    // get text from everything generator
    try {
      const result = await fetchTextAndUpdateConfig(
        configObj,
        'aiInitialStartupRequestCount',
        everythingGenerator,
        undefined
      );
      return result;
    } catch (error) {
      console.error('Error fetching from Markov Text generator:', error);
      throw new Error('Text generation failed'); // Throw an error directly
    }
  }
}

// @desc    return text generated from the default markov text sources
// @route   GET /api/v1/markovtext
// @access  public
exports.getMarkovText = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const result = await generateTextFromConfigObj(reqQuery);
    res.status(200).json({
      success: true,
      text: result.data.text,
      systemErrorText: result.data.systemErrorText,
      configObj: result.configObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'There was an error on the server.'
    });
  }
};

exports.addMarkovText = async (req, res, next) => {
  //connect to database
  const conn = await connectDB();

  fsExtra.emptyDir('./uploads', err => {
    if (err) {
      res.status(500).json({ success: false, err: err });
      return;
    }

    try {
      const form = formidable({
        uploadDir: './uploads',
        multiples: true,
        keepExtensions: true
      });

      //@err - Error object
      //@fields - Object - Any fields uploaded in the formData
      //@files - Object - Any files uploaded with the formData
      form.parse(req, (err, fields, files) => {
        if (err !== null) {
          res.status(500).json({ success: false, err: err });
        }

        const fileObj = {
          name: fields.name,
          description: fields.description,
          tags: fields.tags,
          newFilename: files.file.newFilename,
          createdAt: new Date(),
          isDefault: fields.isDefault
        };

        const documentsObj = processFileUpload(fileObj);

        MarkovText.create(documentsObj, function (err) {
          if (err) return handleError(err);
        });

        res.status(201).json({
          success: true,
          msg: `files uploaded to database`,
          files: files,
          fields: fields
        });
      });
    } catch (err) {
      res.status(500).json({ sucess: false, error: err });
    }
  });
};
