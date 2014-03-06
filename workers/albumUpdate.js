var albumRes = require('../resources/album_res'),
		noop = require('../utils/noop');


module.exports.run = function(channel) {

	channel.on('album_update', function (album) {
		// check if the album exist in database
		albumRes.fetchByInfos(album.name, album.artist, function (err, dbAlbum) {
			if (err)
				return console.log(err);

			// album allready exists nothing to do
			if (dbAlbum)
				return;

			var options = album.date ? {year: album.date.getFullYear()} : {};

			var albumItem = new albumRes.Album(album.imageUrl, album.name, album.artist, options);
			albumRes.save(albumItem, noop);
		});
	});

};