'use strict';

var navit = require('navit')
  , assert = require('chai').assert;

describe('Search and replace API', function () {

  var browser = navit({
    prefix: 'http://localhost:12345'
  });

  before(function (done) {
    browser.run(done);
  });

  it('find', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .find(/LINE/i, 9)
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'line');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'Second line');
      })
      .run(done);
  });

  it('findNext', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .findNext(/Second/i)
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'Second line');
      })
      .get.evaluate(function () {
        return window._ta
          .findNext(/line/i)
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'Third line');
      })
      .run(done);
  });

});
