var db = require('./db');

var Albums;

db.connect(function (db) {
	Albums = db.define('albums', {
		image_url: { type: 'text', size: 512, required: true},
		last_update: { type: 'number', required: true},
		name: { type: 'text', size: 256, required: true },
		artist: { type: 'text', size: 256, required: true},
		year: { type: 'number'},
		main_song: { type: 'text', size: 256},
		category: { type: 'text', size: 256},
		key: { type: 'text', size: 512}
	});
});


module.exports.fetchById = function (albumId, done) {
	Albums.get(albumId, function (err, album) {
		if (err)
			return done(err);

		return done(null, album);
	});
};


module.exports.fetchByKey = function (key, done) {
	Albums.find({key: key}, function (err, albumList) {
		if (err)
			return done(err);

		if (albumList.length > 1)
			console.log('Found multiple album WTF ???');

		return done(null, albumList[0]);
	});
};

module.exports.fetchAllFromUpdate = function (lastUpdate, done) {
	if (!lastUpdate)
		return Albums.find(done);
	
	Albums.find().where('last_update > ?', [lastUpdate]).run(done);
};

var update = function (album, done) {
	Albums.get(album.id, function (err, entry) {
		if (err)
			return done(err);

		entry.save(album, function (err) {
			if (err)
				return done(err);

			return done(null, album.id);
		});
	});
};

var create = function (album, done) {
	Albums.create([album], function (err, albums) {
		if (err)
			return done(err);

		return done(null, albums[0].id);
	});
};


module.exports.save = function (album, done) {
	if (album.id)
		return update(album, done);

	return create(album, done);
};


