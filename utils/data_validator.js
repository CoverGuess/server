var config = require('../config');

module.exports.validateAlbumInfos = function (infos) {
  // validate artist
  if (!infos.artistName || !isValidString(infos.artistName))
    return false;

  // validate album name
  if (!infos.albumName || !isValidString(infos.albumName))
    return false;

  if (infos.albumName.match(/best of/i))
    return false;

  if (infos.albumName.match(/CD\d/i))
    return false;

  return true;
};


function isValidString(string) {
  return string && string.length < config.MAX_STRING_LENGTH;
}