var orm = require('orm'),
		config = require('../config');

module.exports.connect = function (query) {
	var connectionString = 'mysql://' + config.DB_USER_NAME + ':' + config.DB_PASS + '@' + config.DB_HOST + '/' + config.DB_NAME;
	console.log(connectionString);
	orm.connect(connectionString, function (err, db) {
		if (err)
			throw err;

		query(db);
	});
};