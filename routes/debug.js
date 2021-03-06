var topDownloader = require('../downloaders/top_downloader'),
    async = require('async'),
    Album = require('../resources/album_res'),
    _ = require('underscore'),
    aws = require('../utils/aws');

exports.mount = function (app) {
  
  app.get('/debug', function (req, res) {
    var list = [];
    topDownloader.fetchUkTop100(function (err, albumInfos) {
      if (err)
        return res.send(500);

      console.log('Fetching ', albumInfos.length, ' albums');
      async.eachSeries(albumInfos, function (albumInfo, callback) {

        async.waterfall([
          function (done) {
            aws.getCover(albumInfo.albumName, albumInfo.artistName, function (err, imageUrl) {
              if (err)
                return done(null, null, null);

              return done(err, imageUrl, albumInfo);
            });
          },

          function (imageUrl, albumInfo, done) {
            if (!imageUrl)
              return done(null, null, null, null);

            aws.getMetadata(albumInfo.albumName, albumInfo.artistName, function (err, metadatas) {
              if (err)
                return done(null, null, null, null);

              return done(err, imageUrl, albumInfo, metadatas);
            });
          },

          function (imageUrl, albumInfo, metadatas, done) {
            if (!metadatas)
              return done(null);

            var item = {image: imageUrl, datas: metadatas};
            list.push(item);
            console.log(item);
            setTimeout(function () {
              done(null);
            }, 1000);
          }
        ], function (err) {
          callback(err);
        });

      }, function (err) {
        console.log(err);
        res.send(200);
      });
    });
  });


  app.get('/debug/scraper', function (req, res) {
    //topDownloader.fetchUkTop100(function (err, albums) {
    require('../downloaders/rs_top500')(function (err, albums) {
      if (err)
        return res.send(500, err);

      return res.send(albums);
    });
  });


  app.get('/debug/db', function (req, res) {
    var album = new Album('somewhere', 'nom', 'artiste');
    Album.save(album, function (err, results) {
      if (err) {
        console.log(err);
        return res.send(500);
      }

      console.log(results);
      return res.send(200, results);
    });
  });
};