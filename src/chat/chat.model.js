'use strict';
const Bluebird = require('bluebird');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// PromisifyAll
Bluebird.promisifyAll(mongoose.Query);
Bluebird.promisifyAll(mongoose.Query.prototype);

Bluebird.promisifyAll(mongoose.Model);
Bluebird.promisifyAll(mongoose.Model.prototype);

const chatSchema = new Schema({
  from: {type: String, required: true, index: true, lowercase: true},
  messageType: {type: String, required: true, default: 'chat'},
  data: {},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', chatSchema);