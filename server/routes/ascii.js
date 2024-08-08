const express = require('express');
const router = express.Router();
const { getMarkovText } = require('../controllers/ascii');

router.route('/').get(getMarkovText);

module.exports = router;
