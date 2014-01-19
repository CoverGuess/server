var aws = require('../utils/aws'),
    _ = require('underscore'),
    async = require('async'),
    topDownloader = require('../utils/top_downloader');

exports.mount = function (app) {

  app.post('/cover/show', function (req, res) {
    aws.getCover(req.body.title, function (err, imageUrl) {
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
    aws.getCover(req.body.title, function (err, imageUrl) {
      if (err) {
        console.log(err);
        if (err !== 'not_found')
          return res.send(500, err);

        return res.send(200, 'No album found !');
      }

      return res.render('cover', {imageUrl: imageUrl});
    });
  });

  app.get('/top100', function (req, res) {
    topDownloader.fetchUkTop100(function (err, nameList) {
      if (err)
        return res.send(500, err);

      console.log(nameList);
      async.mapSeries(nameList, function (title, done) {
        aws.getCover(title, null, function (err, imageUrl) {
          if (err) {
            console.log(title, 'FAILED');
            return done(null, null);
          }

          console.log(title, 'OK');
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