var topDownloader = require('../utils/top_downloader'),
    async = require('async'),
    _ = require('underscore'),
    aws = require('../utils/aws');

exports.mount = function (app) {
  /*
  app.get('/debug', function (req, res) {

    topDownloader.fetchUkTop100(function (err, albumInfos) {
      if (err)
        return res.send(500);

      async.each(albumInfos, function (albumInfo) {
        async.watarfall([
          function (done) {
            aws.getCover(albumInfo.albumName, albumInfo.artistName, function (err, imageUrl) {
              done(err, imageUrl, albumInfos);
            });
          },

          function (imageUrl, albumInfo, done) {
            
          },

        ]);
      });
    });
  });
*/
};