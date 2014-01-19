var mysql = require('mysql'),
    config = require('../config');

var connect = mysql.createConnection({host: config.SQL_HOST, user: config.SQL_USER, password: config.SQL_PASSWORS});


module.exports = function (tableName) {
  var self = this;

  this.tableName = tableName;

  this.select = function (fields, where, done) {
    select(self.tableName, fields, where, done);
  };

  this.insert = function (fields, done) {
    insert(tableName, fields, done);
  };
};


var select = function (tableName, fields, where, done) {
  var whereString = Object.keys(where)[0] + ' = ' + where[Object.keys(where)[0]];
  var query = 'SELECT ' + fields.join(', ') +
              ' FROM ' + tableName +
              ' WHERE ' + whereString;
  connect.query(query, function (err, results) {
    if (err)
      return done(err);

    done(null, results);
  });
};

var insert = function (tableName, fields, done) {
  var query = 'INSERT INTO ' + tableName +
              'SET ?';
  connect.query(query, fields, function (err, results) {
    if (err)
      done(err);

    done(null, results.insertId);
  });
};