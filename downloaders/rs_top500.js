var url = require('url'),
    cheerioHelper = require('../utils/cheerio_helper'),
    async = require('async'),
    channel = require('../utils/channel'),
    _ = require('underscore'),
    config = require('../config');

module.exports = function () {
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
          return console.log(err);

        extractInfos(text, cb);
      });
    };
  };

  cheerioHelper.executeOnPage(config.FETCH_ROLLING_STONES_TOP_500, getAllUrls, function (err, urls) {
    if (err)
      return console.log(err);

    console.log(urls.length, 'urls found');

    var urlTasks = _(urls).map(createUrlTask);

    async.parallelLimit(urlTasks, 5, function (err, results) {
      if (err)
        return console.log(err);

      console.log('Found', _(results).compact().length, 'albums (rs top 500)');
    });
  });
};

var extractInfos = function (text, done) {
  // fix original text
  if (text[text.length - 1] !== '\'')
    text = text + '\'';

  var artist = '',
      album = '',
      splitedText = text.split(',');


  if (splitedText.length <= 1) {
    console.log({message: 'Can`\'t parse string', string: text});
    return done(null, null);
  }

  _(splitedText).each(function (part, index) {
    if (index === splitedText.length - 1)
      album = part;
    else
      artist = artist + ',' + part;
  });

  artist = artist.substring(1);

  var albumMatch = album.match(/'.+'$/);

  if (!albumMatch || !albumMatch.length) {
    console.log({message: 'Error while parsing album : ' + album, string: text});
    return done(null, null);
  }

  var infos = {albumName: albumMatch[0].substring(1, albumMatch[0].length - 1), artistName: artist};
  console.log(infos);
  channel.send('fetch_cover', infos);
  done(null, infos);
};