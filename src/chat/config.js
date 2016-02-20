'use strict';
module.exports = {
  keyPrefix: 'b44d29', // unique namespace to avoid collisions.
  keyExpiredChannel: '__keyevent@0__:expired', // http://redis.io/topics/notifications

  expiresIn: 10 * 60, // in seconds
};