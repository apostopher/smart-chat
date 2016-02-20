'use strict';

module.exports = {
  url: process.env.MONGO_URL || 'localhost',
  name: process.env.DB_NAME || 'smart-chat'
};
