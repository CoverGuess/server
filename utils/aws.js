var config = require('../config'),
    aws = require('aws-lib');


var prodAdv = aws.createProdAdvClient(config.AWS_ACCES_KEY_ID, config.AWS_ACCES_KEY_SECRET, config.AWS_ASSOCIATE_TAG);

exports.getCover = function (title, artist, done) {
  //console.log('getting cover for album:', title);
  prodAdv.call('ItemSearch', {SearchIndex: 'Music',
                              Title: title,
                              Keywords: artist,
                              ResponseGroup: 'Images',
                              Sort: 'salesrank'},
  function (err, response) {

    if(err)
      return done(err);

    if (parseInt(response.Items.TotalResults) === 0)
      return done('not_found');

    if (!response.Items.Item[0])
      return done('not_found');

    var imageUrl = response.Items.Item[0].LargeImage.URL;

    return done(null, imageUrl);
  });
};

exports.getMetadata = function (title, artist, done) {
  prodAdv.call('ItemSearch', {SearchIndex: 'Music',
                              Title: title,
                              Keywords: artist,
                              ResponseGroup: 'ItemAttributes',
                              Sort: 'salesrank'},
  function (err, response) {
    if(err)
      return done(err);

    if (parseInt(response.Items.TotalResults) === 0)
      return done('not_found');

    if (!response.Items.Item[0])
      return done('not_found');

    var metaDatas = {},
        Item = response.Items.Item[0].ItemAttributes;
    metaDatas.artistName = Item.Artist;
    metaDatas.albumTitle = Item.Title;
    if (Item.ReleaseDate) {
      var dateParts = Item.ReleaseDate.split('-');
      metaDatas.releaseDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
    }
    return done(null, metaDatas);
  });
};