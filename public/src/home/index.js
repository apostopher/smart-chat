'use strict';

module.exports = function (ngModule) {
  require('./home.scss');
  require('./home.config')(ngModule);
  require('./home.controller')(ngModule);
  require('./poll.directive')(ngModule);
};