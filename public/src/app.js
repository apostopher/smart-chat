'use strict';
const angular = require('angular');
require('angular-ui-router');
require('moment');
require('angular-moment');
require('moment-countdown');
require('angularjs-scroll-glue');

const ngModule = angular.module('smartchat', [
  'ui.router',
  'angularMoment',
  'luegg.directives'
]);

/* @ngInject */
ngModule.run(function (realtimeService) {
  realtimeService.init();
});


// Load modules
require('./common')(ngModule);
require('./realtime')(ngModule);
require('./home')(ngModule);