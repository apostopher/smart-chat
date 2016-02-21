'use strict';

const _ = require('lodash');
module.exports = function (ngModule) {
  ngModule
    .factory('realtimeService', realtimeService);

  /* @ngInject */
  function realtimeService($window, $rootScope) {
    let socket;

    return {
      init,
      send
    };

    //Implementation ---
    function init() {
      socket = $window.io();
      socket.on('chat message', messageHandler('chat message'));
      socket.on('poll response', messageHandler('chat message'));
      socket.on('bot message', messageHandler('bot message'));
    }

    function send(message, type) {
      socket.emit(type || 'chat message', _.assign(message, {room: 'hacksummit'}));
    }

    function messageHandler(type) {
      return (message) => {
        $rootScope.$broadcast(type, message);
      };
    }

  }
}