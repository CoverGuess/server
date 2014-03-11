var aws = require('../utils/aws'),
    _ = require('underscore'),
    async = require('async'),
    topDownloader = require('../downloaders/top_downloader');

exports.mount = function (app) {

  app.post('/cover/show', function (req, res) {
    aws.getCover(req.body.title, req.body.artist, function (err, imageUrl) {
      if (err) {
        console.log(err);
        if (err !== 'not_found')
          return res.send(500, err);

        return res.send(200, 'No album found !');
      }
      console.log(imageUrl);
      return res.render('cover', {imageUrl: imageUrl});
    });
  });

  app.post('/cover/getInfos', function (req, res) {
    aws.getMetadata(req.body.title, req.body.artist, function (err, metadatas) {
      if (err) {
        console.log(err);
        if (err !== 'not_found')
          return res.send(500, err);

        return res.send(200, 'No album found !');
      }

      return res.render(metadatas);
    });
  });

  app.get('/top100', function (req, res) {
    topDownloader.fetchUkTop100(function (err, albumList) {
      if (err)
        return res.send(500, err);

      console.log(albumList);
      async.mapSeries(albumList, function (album, done) {
        aws.getCover(album.albumName, album.artistName, function (err, imageUrl) {
          if (err) {
            console.log(album.albumName, 'FAILED');
            return done(null, null);
          }

          console.log(album.albumName, 'OK');
          return done(null, imageUrl);
        });
      }, function (err, results) {
        if (err)
          res.send(500, err);

        res.render('cover', {urlList: _.compact(results)});
      });
    });
  });
};