'use strict';
const _ = require('lodash');
module.exports = function (ngModule) {
  ngModule.controller('HomeCtrl', HomeCtrl);

  /* @ngInject */
  function HomeCtrl($scope, $state, localStoreService, realtimeService, $http) {
    const vm = this;
    vm.chats = [];
    vm.choices = [1,2,3];
    vm.username = localStoreService.get('username');
    vm.postChatmessage = postChatmessage;
    vm.createPoll = createPoll;
    vm.removePoll = removePoll;
    vm.submitPoll = submitPoll;
    vm.castVote = castVote;
    vm.joinChat = joinChat;

    // get old posts
    $http.get('/api/chat').success((data)=>{
      vm.chats = _.reverse(data);
    });

    const removeChatListener = $scope.$on('chat message', function (event, data) {
      const id = data._id;
      const index = _.findIndex(vm.chats, (chatMessage)=>{
        return chatMessage._id === id;
      });
      if(index === -1) {
        $scope.$apply(()=>{
          vm.chats.push(data);
        });
      } else {
        $scope.$apply(()=>{
        vm.chats.splice(index, 1, data);
        })
      }
    });

    $scope.$on('$destroy', ()=>{
      removeChatListener();
    });
    if(vm.username) {
      joinChat({username: vm.username});
    }

    // Implementation ---
    function castVote(id, option) {
      console.log(option)
      $http.post('/api/poll/vote', {id, option, username: vm.username}).success(()=>{

      }).error((error)=>{
        vm.error = error;
      });
    }

    function joinChat(user) {
      const username = _.get(user, 'username', '').trim().toLowerCase();
      if(username) {
        realtimeService.send(user, 'authenticate');
        localStoreService.set('username', username);
        vm.username = username;
      } else {
        vm.error = 'Please enter a valid nickname';
      }
    }

    function postChatmessage(data) {
      const message = (data.text || '').trim().toLowerCase();
      if(_.startsWith(message, ':poll')) {
        data.text = '';
        createPoll();
      } else {
        data.text = '';
        realtimeService.send({message});
      }
    }

    function createPoll() {
      vm.pollData = {};
      vm.showPoll = true;
    }

    function removePoll() {
      vm.pollData = {};
      vm.showPoll = false;
    }

    function submitPoll(data) {
      let chatMessage = {};
      chatMessage.type = 'poll';
      chatMessage.message = _.reduce(data.options, (memo, option, key)=>{
        const qn = option.trim().toLowerCase();
        if(qn) {
          memo['o' + key] = {qn, ans: []};
        }
        return memo;
      }, {});
      realtimeService.send(chatMessage);
      removePoll();
    }

  }
}