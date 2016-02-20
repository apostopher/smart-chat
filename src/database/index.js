'use strict';
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const config = require('./config');


Bluebird.promisifyAll(mongoose);

Bluebird.promisifyAll(mongoose.Query);
Bluebird.promisifyAll(mongoose.Query.prototype);

Bluebird.promisifyAll(mongoose.Model);
Bluebird.promisifyAll(mongoose.Model.prototype);

module.exports = {
  connect
};

// Implementation ---
function connect(name) {
  const options = {
    db: {native_parser: true},
    server: {socketOptions: {keepAlive: 120}}
  };
  return mongoose.connectAsync(`mongodb://${config.url}/${name || config.name}`, options);
}
