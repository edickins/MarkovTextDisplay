const MarkovTextGenerator = require('../modules/MarkovTextGenerator');
const MarkovChain = require('markov-chain-nlg');

const fsExtra = require('fs-extra');
const formidable = require('formidable');
const connectDB = require('../config/db');
const processFileUploads = require('../modules/processFileUploads');
const MarkovText = require('../models/MarkovText');

const aiInitialStartupText = [
  '=========================',
  '[Terminal Boot Sequence]',
  ' ',
  'Welcome to bleebloop v1.0'
];

const systemStartupGenerator = new MarkovTextGenerator(['system_startup']);
systemStartupGenerator.init();

const aiGenerator = new MarkovTextGenerator(['ai']);
aiGenerator.init();

// const funGenerator = new MarkovTextGenerator(['fun']);
// funGenerator.init();

const seriousGenerator = new MarkovTextGenerator(['serious']);
seriousGenerator.init();

const funSeriousGenerator = new MarkovTextGenerator(['serious', 'fun']);
funSeriousGenerator.init();

const everythingGenerator = new MarkovTextGenerator(['serious', 'fun', 'ai']);
everythingGenerator.init();

const generators = [
  systemStartupGenerator,
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

async function generateTextFromConfigObj(configObj) {
  if (configObj) {
    // (get specific initial startup text from a static Array)
    if (configObj.aiInitialStartupRequestCount >= 0) {
      return {
        data: aiInitialStartupText[configObj.aiInitialStartupRequestCount],
        configObj: {
          ...configObj,
          aiInitialStartupRequestCount:
            configObj.aiInitialStartupRequestCount - 1
        }
      };
    }

    configObj.isInitialised = true;

    // inform user of system status from the systemStartupGenerator
    if (configObj.aiStartupRequestCount >= 0) {
      console.log(`aiStartupRequestCount`, configObj.aiStartupRequestCount);
      try {
        const result = await systemStartupGenerator.getText(0);
        console.log('text:', result.data);
        return {
          data: result.data,
          configObj: {
            ...configObj,
            aiStartupRequestCount: configObj.aiStartupRequestCount - 1
          }
        };
      } catch (error) {
        console.error('Error fetching startup text:', error);
        return {
          data: 'error',
          configObj: {
            ...configObj,
            aiStartupRequestCount: configObj.aiStartupRequestCount - 1
          }
        };
      }
    }

    // Default random text generator (no config settings used)
    try {
      const result = await everythingGenerator.getText();
      return {
        data: result.data,
        configObj
      };
    } catch (error) {
      console.error('Error fetching startup text:', error);
      return {
        data: 'error',
        configObj: {
          ...configObj,
          aiStartupRequestCount: configObj.aiStartupRequestCount - 1
        }
      };
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
    res
      .status(200)
      .json({ success: true, text: result.data, configObj: result.configObj });
  } catch (error) {
    res.status(400).json({ success: false });
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
