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
        return window._z
          .find(/LINE/i, 9)
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'line');
      })
      .get.evaluate(function () {
        return window._z
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
        return window._z
          .findNext(/Second/i)
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'Second line');
      })
      .get.evaluate(function () {
        return window._z
          .findNext(/line/i)
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'Third line');
      })
      .run(done);
  });

  it('replace', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .replace(/LINE/i, 'string', 9)
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'string');
      })
      .get.evaluate(function () {
        return window._z
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'Second string');
      })
      .run(done);
  });

  it('replaceNext', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .replaceNext(/LINE/i, 'string')
          .replaceNext(/LINE/i, 'string')
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'Second string');
      })
      .run(done);
  });

  it('replaceAll', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .replaceAll(/\s*LINE/gi, '')
          .selectLines(0, 3)
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'First\nSecond\nThird');
      })
      .run(done);
  });

});
