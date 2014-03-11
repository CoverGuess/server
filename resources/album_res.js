var albumDb = require('../database/album_db'),
    strings = require('../utils/strings'),
    async = require('async'),
    _ = require('underscore');

var Album = function (imageUrl, name, artist, opt) {
  var options = opt || {};
  this.id = options.id || null;
  this.imageUrl = imageUrl;
  this.lastUpdate = options.last_update || Date.now();
  this.name = name;
  this.artist = artist;
  this.year = options.year || null;
  this.mainSong = options.main_song || null;
  this.category = options.category || null;
  this.key = options.key || null;
};
module.exports.Album = Album;

var deserialize = function (blob, done) {
  var options = _(blob).pick('last_update', 'year', 'main_song', 'category', 'id', 'key'),
      album = new Album(blob.image_url, blob.name, blob.artist, options);

  done(null, album);
};

module.exports.fetchById = function (id, done) {
  albumDb.fetchById(id, function (err, album) {
    if (err)
      return done(err);

    return deserialize(album, done);
  });
};

module.exports.fetchByInfos = function (name, artist, done) {
  module.exports.fetchByKey(makeKey(name, artist), done);
};

module.exports.fetchByKey = function (key, done) {
  albumDb.fetchByKey(key, function (err, album) {
    if (!err)
      return done(null, album);

    console.log(err);
    return done(null, null);
  });
};

module.exports.fetchAllFromUpdate = function (lastUpdate, done) {
  albumDb.fetchAllFromUpdate(lastUpdate, function (err, dbAlbums) {
    var albums = [];
    async.each(dbAlbums, function (album, cb) {
      deserialize(album, function (err, album) {
        if (err)
          return cb(err);

        albums.push(album);
        cb(null);
      });
    }, function (err) {
      if (err)
        return done(err);

      done(null, albums);
    });
  });
};

module.exports.save = function (album, done) {
  serialize(album, function (err, blob) {
    albumDb.save(blob, done);
  });
};

var makeKey = function (albumName, artist) {
  // concat album name and artist name
  var key = albumName.toLowerCase() + '_' + artist.toLowerCase();
  // remove whitespaces
  key = key.replace(/\s/g, '');
  // remove every non alphanumérique char
  key = strings.latinize(key);
  return key;
};

var serialize = function (album, done) {
  var blob = {
    id: album.id || null,
    image_url: album.imageUrl,
    last_update: album.lastUpdate,
    name: album.name,
    artist: album.artist,
    year: album.year || null,
    main_song: album.mainSong || null,
    category: album.category || null,
    key: makeKey(album.name, album.artist)
  };

  done(null, blob);
};