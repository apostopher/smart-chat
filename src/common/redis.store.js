'use strict';
const _ = require('lodash');
const redisConfig = require('./config').redisConfig;
const Redis = require('ioredis');
const winston = require('winston');


const pub = new Redis(redisConfig);
const sub = new Redis(redisConfig);

// Error handling
pub.on('error', (error)=> {
  winston.error(error);
});

sub.on('error', (error)=> {
  winston.error(error);
});

module.exports = {pub, sub};


