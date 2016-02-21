'use strict';
const _ = require('lodash');
module.exports = function (ngModule) {
  ngModule.directive('poll', pollDirective);

  /* @ngInject */
  function pollDirective() {
    return {
      restrict: 'E',
      replace: true,
      template: require('./poll.html'),
      scope: {
        showPoll: '=',
      },
      link: function (scope) {
        scope.data = {};
        scope.removePoll = removePoll;
        // Implementation ---
        function removePoll() {
          if(!scope.viewMode) {
            scope.showPoll = false;
            scope.data = {};
          }
        }
      }
    };
  }
}