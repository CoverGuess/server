var http = require('http');

module.exports = function (url, done) {
  http.get(url, function(res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      done(null, data);
    });
  }).on('error', function(err) {
    done(err);
  });
};