'use strict';

var app = require('../app');

before(function (done) {
  app.run(done);
});

require('./selection');
require('./search');
require('./manipulation');
