var albumRes = require('../resources/album_res'),
		_ = require('underscore');

exports.mount = function (app) {

	app.get('/backend/list_albums', function (req, res) {
		albumRes.fetchAllFromUpdate(null, function (err, albums) {
			if (err)
				return res.send(500, err);

			res.render('backend_list', {albums: _(albums).toArray()});
		});
	});

	app.all('/backend/album/:key*', function (req, res, next) {
		var key = req.params.key;
		if (!key)
			return res.send(500, 'no key');

		albumRes.fetchByKey(key, function (err, album) {
			if (err)
				return res.send(500, err);
			console.log(album);
			req.album = album;

			next();
		});
	});

	app.get('/backend/album/:key*', function (req, res) {
		res.render('backend_image', {img_url: req.album.image_url});
	});
};