const generator = require('../modules/asciiGenerator.js');

// @desc    return text generated from the default markov text sources
// @route   GET /api/v1/markovtext
// @access  public
exports.getMarkovText = (req, res, next) => {
	const initObj = {
		fileName: 'standard',
		format: 'json',
		folderName: 'ascii',
	};
	// return a Promise
	res.status(200).json({ success: true, texts: generator.getText({}) });
};
