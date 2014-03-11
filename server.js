var express = require('express'),
    config = require('./config'),
    longjhon = require('longjohn');
    routes = require('./routes');

var app = express();

require('./workers');
require('./utils/updater');

app.configure(function () {
  app.set('view engine', 'html');
  app.engine('.html', require('ejs').__express);
  app.use(express.urlencoded());
  app.use(app.router);
});

routes.mount(app);

app.listen(config.PORT);