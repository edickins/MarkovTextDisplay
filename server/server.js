var fs = require('fs');
const express = require('express');
var http = require('http');
var https = require('https');
const dotenv = require('dotenv');
const { request } = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// routes
const markovtext = require('./routes/markovtext');
const ascii = require('./routes/ascii');

// Load in env vars
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(
  cors({
    origin: ['http://bleepbloop.net', 'https://bleepbloop.net']
  })
);

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

// HTTP server (for local development)
if (process.env.NODE_ENV === 'development') {
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => {
    console.log(
      `Express server running in development on port ${PORT}`.bold.blue
    );
  });
}

// HTTPS server (for production)
if (process.env.NODE_ENV === 'production') {
  var privateKey = fs.readFileSync('../config/ssl/current/ssl.key', 'utf8');
  var certificate = fs.readFileSync('../config/ssl/current/ssl.crt', 'utf8');
  var credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(PORT, () => {
    console.log(
      `Express server running in production on port ${PORT}`.bold.red
    );
  });
}
