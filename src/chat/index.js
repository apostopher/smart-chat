'use strict';
const _ = require('lodash');
const redis = require('../common/redis.store').pub;
const config = require('./config');
const chatService = require('./chat.service');

module.exports = chatHandler;

// Implementation ---
function chatHandler(socket) {
  const username = _.get(socket, 'user.username');
  socket.on('join room', (payload)=> chatService.onJoin(socket, payload));
  socket.on('leave room', (payload)=> chatService.onLeave(socket, payload));
  socket.on('chat message', (payload)=> chatService.onMessage(socket, payload));

  socket.on('typing', () => {
    socket.broadcast.emit('typing', {username});
  });
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {username});
  });

  socket.on('disconnect', () => {
    // decrement online count and echo globally that this client has left
    redis.decr(`${config.keyPrefix}:online:count`).then((count)=> {
      socket.broadcast.emit('user left', {
        username: _.get(socket, 'user.username'),
        onlineUsers: count > 0 ? count : 0
      });
    }).catch(()=> {
      socket.broadcast.emit('user left', {username: _.get(socket, 'user.username')});
    });
  });
  // increment online count and send message to all
  redis.incr(`${config.keyPrefix}:online:count`).then((count)=> {
    socket.broadcast.emit('user joined', {
      username: _.get(socket, 'user.username'),
      onlineUsers: count > 0 ? count : 1
    });
  }).catch(()=> {
    socket.broadcast.emit('user joined', {username: _.get(socket, 'user.username')});
  });
}
