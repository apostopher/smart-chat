'use strict';

module.exports = function (ngModule) {
  require('./common.scss');
  require('./local.store.service')(ngModule);
};