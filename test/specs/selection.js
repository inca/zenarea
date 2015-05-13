'use strict';

var navit = require('navit')
  , app = require('../app')
  , assert = require('chai').assert;

describe('Selection API', function () {

  var browser = navit({
    prefix: 'http://localhost:12345'
  });

  before(function (done) {
    app.run(function (err) {
      if (err) return done(err);
      browser.run(done);
    });
  });

  it('getSelection', function (done) {
    browser.open('/selection.html')
      .get.evaluate(function () {
        window._ta._textarea.selectionStart = 6;
        window._ta._textarea.selectionEnd = 10;
        return window._ta.getSelection();
      }, function (selection) {
        assert.equal(selection.start, 6);
        assert.equal(selection.end, 10);
        assert.equal(selection.length, 4);
        assert.equal(selection.text, 'line');
      })
      .run(done);
  });

  it('setSelection', function (done) {
    browser.open('/selection.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(11, 22)
          .getSelection();
      }, function (selection) {
        assert.equal(selection.start, 11);
        assert.equal(selection.end, 22);
        assert.equal(selection.text, 'Second line');
      })
      .get.evaluate(function () {
        return window._ta
          .setSelection(16)
          .getSelection();
      }, function (selection) {
        assert.equal(selection.start, 16);
        assert.equal(selection.end, 16);
        assert.equal(selection.text, '');
      })
      .run(done);
  });

  it('selectAll', function (done) {
    browser.open('/selection.html')
      .get.evaluate(function () {
        return window._ta
          .selectAll()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.length, 33);
      })
      .run(done);
  });

  it('selectCurrentLines', function (done) {
    browser.open('/selection.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(16)     // Caret is on the second line
          .selectCurrentLines()
          .selectCurrentLines() // Calling repeatedly does not affect selection
          .getSelection();
      }, function (selection) {
        assert.equal(selection.start, 11);
        assert.equal(selection.end, 22);
        assert.equal(selection.length, 11);
      })
      .get.evaluate(function () {
        return window._ta
          .setSelection(1, 2)    // Selection spans first line
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.start, 0);
        assert.equal(selection.end, 10);
        assert.equal(selection.length, 10);
      })
      .run(done);
  });

});
