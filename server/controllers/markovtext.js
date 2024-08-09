const MarkovTextGenerator = require('../modules/MarkovTextGenerator');

const fsExtra = require('fs-extra');
const formidable = require('formidable');
const connectDB = require('../config/db');
const processFileUploads = require('../modules/processFileUploads');
const MarkovText = require('../models/MarkovText');

const aiGenerator = new MarkovTextGenerator(['ai']);
aiGenerator.init();

const funGenerator = new MarkovTextGenerator(['fun']);
funGenerator.init();

const seriousGenerator = new MarkovTextGenerator(['serious']);
seriousGenerator.init();

const funSeriousGenerator = new MarkovTextGenerator(['serious', 'fun']);
funSeriousGenerator.init();

const everythingGenerator = new MarkovTextGenerator(['serious', 'fun', 'ai']);
everythingGenerator.init();

const generators = [
  aiGenerator,
  aiGenerator,
  aiGenerator,
  aiGenerator,
  aiGenerator,
  funSeriousGenerator,
  everythingGenerator
];

function getRandomGenerator() {
  const generatorIndex = Math.floor(Math.random() * generators.length);
  return generators[generatorIndex];
}

// @desc    return text generated from the default markov text sources
// @route   GET /api/v1/markovtext
// @access  public
exports.getMarkovText = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const result = await getRandomGenerator().getText(reqQuery);
    res.status(200).json({ success: true, text: result.data });
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
