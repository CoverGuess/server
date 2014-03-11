var channel = require('./channel'),
    _ = require('underscore'),
    async = require('async'),
    dataValidator = require('./data_validator'),
    aws = require('./aws'),
    topDownloader = require('../downloaders/top_downloader');

channel.on('full_update', function () {
  // top downloaders fire 'fetch_cover' events for each album
  topDownloader.fetchAll();
});

var fetchQueue = async.queue(function (task, done) {
  var albumName = task.albumName,
      artistName = task.artistName;

  aws.getCover(albumName, artistName, function (err, imageUrl) {
    if (err)
      return done(err);
    setTimeout(function () {
      aws.getMetadata(albumName, albumName, function (err, metaDatas) {
        if (err)
          return done(err);

        channel.send('album_update', {
          name: albumName,
          artist: artistName,
          imageUrl: imageUrl,
          date: metaDatas.releaseDate || null
        });
        setTimeout(done, 500);
      });
    }, 500);
  });
}, 1);

channel.on('fetch_cover', function (albumInfo) {
  if (!dataValidator.validateAlbumInfos(albumInfo))
    console.log(albumInfo, 'didn\'t pass validation');
  
  fetchQueue.push(albumInfo, function (err) {
    if (err)
      return console.log(err, albumInfo.albumName, '-', albumInfo.artistName);

    console.log('fetched', albumInfo.albumName, '-', albumInfo.artistName);
  });
});