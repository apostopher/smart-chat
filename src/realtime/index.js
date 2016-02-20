'use strict';

const _ = require('lodash');
const socketIO = require('socket.io');
const socketIORedis = require('socket.io-redis');

var io;
module.exports = {
  getIo,
  init,
  getSocketById,
  getSocketByUsername
};

// Implementation ---
process.on('SIGTERM', gracefulExit).on('SIGINT', gracefulExit);

function getIo() {
  return io;
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
  // Disconnect if client doesn't connect within 'timeout' value
  const authTimeout = setTimeout(disconnectWithError, 10000, socket);
  // Authenticate token. 'once' is used for memory efficiency.
  // clients can authenticate once. they will have to reconnect again to authenticate.
  socket.once('authenticate', (userData) => {
    clearTimeout(authTimeout);
    socket.user = userData;
    // attach event handlers provided by other modules.
    attachEventHandlers(socket, eventHandlers);
    socket.emit('bot message', {message: `Welcome ${userData.username}`});
  });
}

function attachEventHandlers(socket, eventHandlers) {
  _.each(eventHandlers, (handler) => {
    handler(socket);
  });
}

function disconnectWithError(socket, error) {
  socket.emit('unauthorized', error ? (error.message || error) : 'authorizationTimeout', () => {
    socket.disconnect('unauthorized');
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