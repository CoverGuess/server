var config = require('../config'),
    aws = require('aws-lib');


var prodAdv = aws.createProdAdvClient(config.AWS_ACCES_KEY_ID, config.AWS_ACCES_KEY_SECRET, config.AWS_ASSOCIATE_TAG);

exports.getCover = function (title, artist, done) {
  //console.log('getting cover for album:', title);
  prodAdv.call('ItemSearch', {SearchIndex: 'Music',
                              Title: title,
                              //Keywords: artist,
                              ResponseGroup: 'Images',
                              Sort: 'salesrank'},
  function (err, response) {
    if(err)
      return done(err);
    debugger;
    console.log(response.Items.TotalResults);
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