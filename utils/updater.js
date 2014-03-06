var channel = require('./channel'),
    _ = require('underscore'),
    async = require('async'),
    aws = require('./aws'),
    topDownloader = require('./top_downloader');

channel.on('full_update', function () {
  topDownloader.fetchAll(function (err, tops) {
    if (err)
      return console.log(err);

    console.log('album infos retrieved');

    var albumInfos = [];

    _(tops).each(function (top) {
      albumInfos = albumInfos.concat(top);
    });

    console.log(albumInfos);
    // TODO : function to remove dubs

    _(albumInfos).each(function (albumInfo) {
      channel.send('fetch_cover', albumInfo);
    });
  });
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
          name: metaDatas.albumTitle,
          artist: metaDatas.artistName,
          imageUrl: imageUrl,
          date: metaDatas.releaseDate || null
        });
        setTimeout(done, 500);
      });
    }, 500);
  });
}, 1);

channel.on('fetch_cover', function (albumInfo) {
  fetchQueue.push(albumInfo, function (err) {
    if (err)
      return console.log(err, albumInfo.albumName, '-', albumInfo.artistName);

    console.log('fetched', albumInfo.albumName, '-', albumInfo.artistName);
  });
});