var _ = require('underscore');

var routes = [
    'amazon',
    'debug',
    'api'
];

exports.mount = function (app) {
  _(routes).each(function (route) {
    require('./' + route).mount(app);
  });
};