var channel = require('../utils/channel'),
    albumRes = require('../resources/album_res'),
    _ = require('underscore');

exports.mount = function (app) {

  app.post('/api/get_updates', function (req, res) {

    var lastUpdate = req.body.last_update || null;

    albumRes.fetchAllFromUpdate(lastUpdate, function (err, albums) {
      if (err)
        return res.send(500, err);

      res.send(albums);
    });
  });

  app.post('/api/update_db', function (req, res) {
    channel.send('full_update');
    res.send(200);
  });
};