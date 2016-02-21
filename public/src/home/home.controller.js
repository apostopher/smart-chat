'use strict';

module.exports = function (ngModule) {
  ngModule.controller('HomeCtrl', HomeCtrl);

  /* @ngInject */
  function HomeCtrl($scope, $state, localStoreService, realtimeService, $timeout) {
    const vm = this;
    vm.username = localStoreService.get('username');
    //vm.sendChatMessage = sendChatMessage;
    //vm.createPoll = createPoll;
    //vm.publishPoll = publishPoll;
    //vm.castVote = castVote;
    vm.joinChat = joinChat;

    const removeChatListener = $scope.$on('chat message', function (event, data) {
      console.log(data);
    });

    $scope.$on('$destroy', ()=>{
      removeChatListener();
    });

    joinChat('rahul');
    // Implementation ---
    function joinChat(username) {
      realtimeService.send({username}, 'authenticate');
      $timeout(()=>{
        console.log('sending');
      realtimeService.send({message: 'Hello'});
      }, 3000);

    }

  }
}