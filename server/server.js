const express = require('express');
const dotenv = require('dotenv');
const { request } = require('express');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// routes
const markovtext = require('./routes/markovtext');
const ascii = require('./routes/ascii');

// Load in env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// parse the body of the response
app.use(express.json());

// mount routes
app.use('/api/v1/markovtext/', markovtext);
app.use('/api/v1/ascii/', ascii);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(
		`server running in ${process.env.NODE_ENV} on PORT ${PORT}`.bold.blue
	)
);

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close();
});
