'use strict';

var app = require('../app');

before(function (done) {
  app.run(done);
});

require('./key');
require('./selection');
require('./search');
require('./manipulation');
