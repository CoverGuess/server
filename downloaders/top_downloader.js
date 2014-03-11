var async = require('async');

module.exports.fetchAll = function() {
  console.log('Starting album fetching');
  async.parallel({
    //ukTop100: require('./uk_top100'),
    rollingStonesTop500: require('./rs_top500')
  }, function () {});
};