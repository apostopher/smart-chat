'use strict';
const http = require('http');
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const helmet = require('helmet');
const compress = require('compression');

const config = require('./config');
const database = require('./database');
const realtime = require('./realtime');
const customValidators = require('./common/data.validators');
const webAppLocation = '/home/apostopher/Applications/smart-chat/public/dist';

const app = express();

app.use(express.static(webAppLocation));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(expressValidator({customValidators}));
app.use(methodOverride());
app.use(compress());
app.use(helmet());

// serve web app
app.get('/', function(req, res) {
	res.sendFile(`${webAppLocation}/index.html`);
});

app.get('*', function(req, res) {
	res.sendFile(`${webAppLocation}/index.html`);
});

// Start database
const server = http.createServer(app);
database.connect().then(()=> {
  // Initialize realtime module
  realtime.init(server, require('./chat'));
  // start the server
  server.listen(config.port, onStart);
}).catch((error)=> {
  winston.error(error);
});

// Implementation ---

function onStart() {
  winston.info('smart-chat-server is listening at ' + config.port);
}

