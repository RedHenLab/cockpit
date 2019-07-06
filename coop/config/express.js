const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compress = require('compression');
const bodyParser = require('body-parser');

const app  = express();

// parse JSON request body and attach to req.body
app.use(bodyParser.json());

// secure apps by setting various HTTP headers 
app.use(helmet());

// enable gzip compression
app.use(compress());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

module.exports = app;

