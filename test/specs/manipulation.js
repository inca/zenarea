'use strict';

var navit = require('navit')
  , app = require('../app')
  , assert = require('chai').assert;

describe('Manipulation API', function () {

  var browser = navit({
    prefix: 'http://localhost:12345'
  });

  before(function (done) {
    app.run(function (err) {
      if (err) return done(err);
      browser.run(done);
    });
  });

  it('insertText (w/o preserveSelection)', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(11, 22)  // Select second line
          .insertText('Hello, ')
          .insertText('World')
          .getSelection();
      }, function (selection) {
        assert.equal(selection.start, 23);
        assert.equal(selection.length, 0);
      })
      .run(done);
  });

  it('insertText (w/ preserveSelection)', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(11, 22)  // Select second line
          .insertText('Hello, ', true)
          .insertText('World', true)
          .getSelection();
      }, function (selection) {
        assert.equal(selection.start, 11);
        assert.equal(selection.text, 'World');
      })
      .run(done);
  });

});
