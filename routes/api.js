var async = require('async'),
    _ = require('underscore');

exports.mount = function (app) {

  app.post('/api/get_updates', function (req, res) {
    res.send([{id: 42,
               image_url: 'http://ecx.images-amazon.com/images/I/51VZiX9DStL.jpg',
               album_name: 'Greatest Hits',
               album_artist: 'Guns N Roses',
               last_update: 1390149927}]);
  });
};