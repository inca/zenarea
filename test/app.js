'use strict';

var express = require('express')
  , http = require('http')
  , browserify = require('browserify-middleware')
  , path = require('path');

var app = module.exports = exports = express();

var server = http.createServer(app);

app.get('/zenarea.js', browserify(path.join(__dirname, 'zenarea.js')));

app.use(express.static(path.join(__dirname, 'fixtures')));

app.run = function (done) {
  server.listen(12345, done);
};
