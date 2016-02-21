'use strict';

module.exports = function (ngModule) {
  ngModule.config(homeConfig);

  /* @ngInject */
  function homeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl as home',
        template: require('./home.html')
      });

  }
};