var download = require('./download'),
    _ = require('underscore'),
    config = require('../config'),
    cheerio = require('cheerio');

module.exports.fetchUkTop100 = function(done) {
  download(config.URL_UK_TOP_100, function (err, result) {
    if (err)
      return done(err);

    var albumInfos = [],
        $ = cheerio.load(result);
        /*
    var textNodes = $(elem).contents().filter(function() { return this.nodeType === Node.TEXT_NODE; }); */
    $('td.info div.infoHolder h3').each(function (i, element) {
      albumInfos[i] = {};
      albumInfos[i].albumName = $(element).text();
    });

    $('td.infos div.infoHolder h4').each(function (i, element) {
      albumInfos[i].artistName = $(element).text();
    });

    return done(null, _.compact(albumInfos));
  });
};

