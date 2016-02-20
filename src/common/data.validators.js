'use strict';
const _ = require('lodash');

module.exports = {
  gte: (param, num) => {
    return param >= num;
  },
  lte: (param, num) => {
    return param <= num;
  },
  isString: (param) =>{
    return _.isString(param) && param.length > 0;
  },
  isArrayOfStations: (param, strict) => {
    if (!_.isArray(param)) {
      return false;
    }
    return _.every(param, ({name, suburb})=> {
      return _.isString(name) && (strict ? _.isString(suburb): true);
    });
  }
};
