var download = require('./download'),
    cheerio = require('cheerio');

    
module.exports.executeOnPage = function (url, func, done) {
  download(url, function (err, data) {
    if (err)
      return done(err);

    var $ = cheerio.load(data);

    func($, done);
  });
};