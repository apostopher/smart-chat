'use strict';

const _ = require('lodash');
const socketIO = require('socket.io');
const socketIORedis = require('socket.io-redis');

var io;
module.exports = {
  getIo,
  init,
  getSocketById,
  getSocketByUsername,
  broadcastMessage
};

// Implementation ---
process.on('SIGTERM', gracefulExit).on('SIGINT', gracefulExit);

function getIo() {
  return io;
}

function broadcastMessage(event, data) {
  io.to('hacksumm').emit(event, data);
}

function getSocketById(socketId) {
  return io.sockets.connected[socketId];
}

function getSocketByUsername(username) {
  const sockets = _.get(io, 'sockets.sockets');
  return _.find(sockets, (socket)=>{
    const socketUsername = _.get(socket, 'user.name');
    return  socketUsername && socketUsername === username;
  });
}

function init(server, eventHandlers) {
  io = socketIO(server);
  const adapter = socketIORedis({host: 'localhost', port: 6379});
  io.adapter(adapter);
  io.on('connection', (socket)=> {
    onConnect(socket, eventHandlers);
  });
}

function onConnect(socket, eventHandlers) {
  socket.on('authenticate', (userData) => {
    socket.user = userData;

    // attach event handlers provided by other modules.
    attachEventHandlers(socket, eventHandlers);
    socket.join(userData.room);
    socket.emit('bot message', {message: `Welcome ${userData.username}`});
  });
}

function attachEventHandlers(socket, eventHandlers) {
  _.each(eventHandlers, (handler) => {
    handler(socket);
  });
}

function gracefulExit() {
  const sockets = _.get(io, 'sockets.sockets');
  if(!sockets) {
    process.exit();
  }
  _.map(sockets, (socket)=> {
    socket.disconnect('server is restarting...');
  });
  setTimeout(()=> {
    process.exit();
  }, 2000); // Wait 2 seconds for all sockets to disconnect properly.
}