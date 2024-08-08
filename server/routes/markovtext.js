const express = require('express');
const router = express.Router();
const { getMarkovText, addMarkovText } = require('../controllers/markovtext');

router.route('/').get(getMarkovText).post(addMarkovText);

module.exports = router;
