var download = require('./download'),
    _ = require('underscore'),
    url = require('url'),
    async = require('async'),
    cheerioHelper = require('./cheerio_helper'),
    config = require('../config'),
    cheerio = require('cheerio');


var spookyConf = {
  child: {
    transport: 'http'
  },
  casper: {
    logLevel: 'debug',
    verbose: true
  }
};


var fetchUkTop100 = function (done) {
  console.log('Fetch UK TOP 100');
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

    $('td.info div.infoHolder h4').each(function (i, element) {
      albumInfos[i].artistName = $(element).text();
    });

    done(null, _.compact(albumInfos));
  });
};
module.exports.fetchUkTop100 = fetchUkTop100;

var fetchRollingStonesTop500 = function (done) {
  console.log('Fetch Rolling stones top 500');

  var host = 'http://' + url.parse(config.FETCH_ROLLING_STONES_TOP_500).host;

  //$$('li.jcarousel-item a')
  //'div.listItemDescriptonDiv h3'
  var getAllUrls = function ($, done) {
    var urls = [];

    $('div.listItem a').each(function (i, element) {
      urls.push(host + element.attribs.href);
    });

    done(null, urls);
  };


  var createUrlTask = function (url) {
    return function (cb) {
      var getAlbumInfos = function ($, done) {
        done(null, $('div.listItemDescriptonDiv h3').text());
      };

      cheerioHelper.executeOnPage(url, getAlbumInfos, function (err, text) {
        if (err)
          return done(err);

        console.log(text);
        // parse text
        var artistName = text.match(/.+,/)[0].replace(',', ''),
            albumTitle = text.match(/'.+'$/)[0];

        // clean album title
        albumTitle = albumTitle.substring(1, albumTitle.length - 1);
        console.log(albumTitle, artistName);
        cb(null, {albumName: albumTitle, artistName: artistName});
      });
    };
  };

  cheerioHelper.executeOnPage(config.FETCH_ROLLING_STONES_TOP_500, getAllUrls, function (err, urls) {
    if (err)
      return done(err);

    console.log(urls.length, 'urls found');

    var urlTasks = _(urls).map(createUrlTask);

    async.parallelLimit(urlTasks, 1, function (err, results) {
      if (err)
        return done(err);

      done(null, _.compact(results));
    });
  });
};
module.exports.fetchRollingStonesTop500 = fetchRollingStonesTop500;

module.exports.fetchAll = function(done) {
  console.log('Starting album fetching');
  async.parallel({
    ukTop100: fetchUkTop100,
    rollingStonesTop500: fetchRollingStonesTop500
  }, done);
};