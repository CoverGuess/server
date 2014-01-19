var express = require('express'),
    config = require('./config'),
    routes = require('./routes');

var app = express();

app.configure(function () {
  app.set('view engine', 'html');
  app.engine('.html', require('ejs').__express);
  app.use(express.urlencoded());
  app.use(app.router);
});

routes.mount(app);

app.listen(config.PORT);