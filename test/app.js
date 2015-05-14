'use strict';

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = module.exports = exports = express();

var server = http.createServer(app);

app.use('/build', express.static(path.join(__dirname, '../build')));

app.use(express.static(path.join(__dirname, 'fixtures')));

app.run = function (done) {
  server.listen(12345, done);
};
