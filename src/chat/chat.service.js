'use strict';
const _ = require('lodash');
const winston = require('winston');
const redisSub = require('../common/redis.store').sub;
const redis = require('../common/redis.store').pub;
const config = require('./config');
const Chat = require('./chat.model');

redisSub.subscribe(config.keyExpiredChannel).then(()=> {
  redis.on('message', removeSocketFromRoom);
});

module.exports = {
  onJoin,
  onLeave,
  onMessage
};

// Implementation ---
function removeSocketFromRoom(channel, key) {
  const [prefix ,socketId, room] = key.split(':');
  if ((channel !== config.keyExpiredChannel) || (prefix !== config.keyPrefix)) {
    // this event does not belong to chat server.
    return;
  }
  // check whether this user is still online.
  const socket = realtime.getSocketById(socketId);
  if (socket) {
    // socket is still connected.
    //socket.leave(room);
  }
}

function onJoin(socket, {room}) {
  return redis.set(`${config.keyPrefix}:${socket.id}:${room}`, 1, 'ex', config.expiresIn).then(()=> {
    socket.join(room);
  }).catch((error) => {
    socket.emit('chat error', error);
  });
}

function onLeave(socket, {room}) {
  redis.del(`${config.keyPrefix}:${socket.id}:${room}`).then(()=> {
    socket.leave(room);
  }).catch((error) => {
    socket.emit('chat error', error);
  });
}

function onMessage(socket, {room, message}) {
  return redis.set(`${config.keyPrefix}:${socket.id}:${room}`, 1, 'ex', config.expiresIn).then(()=>{
    const username = _.get(socket, 'user.username', '');
    const chatMessage = new Chat({from: username, data: {message}});
    return chatMessage.saveAsync().then(()=>{
      socket.broadcast.to(room).emit('chat message', {message, username});
    });
  }).catch((error) => {
    winston.error(error);
    socket.emit('chat error', error);
  });
}