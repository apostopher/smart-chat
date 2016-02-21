'use strict';

module.exports = function (ngModule) {
  ngModule
    .factory('localStoreService', localStoreService);

  /* @ngInject */
  function localStoreService() {
    return {
      set: set,
      get: get,
      remove: remove
    };

    //Implementation ---

    function set(key, value) {
      window.localStorage.setItem(key, value);
      return get(key);
    }

    function get(key) {
      return window.localStorage.getItem(key);
    }

    function remove(key) {
      return window.localStorage.removeItem(key);
    }
  }
}