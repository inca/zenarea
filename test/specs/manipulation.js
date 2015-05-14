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

  it('insertText w/o preserveSelection', function (done) {
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

  it('insertText w/ preserveSelection', function (done) {
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

  it('indent at caret', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(16)  // Secon|d
          .indent()
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'Secon  d line');
      })
      .run(done);
  });

  it('indent at selection', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(15, 16)  // Seco|n|d
          .indent()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'n');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, '  Second line');
      })
      .run(done);
  });

  it('indent multiline', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(8, 14)    // First li|ne Sec|ond
          .indent()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'ne\n  Sec');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, '  First line\n  Second line');
      })
      .run(done);
  });

  it('outdent at non-indented', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(16)  // Secon|d
          .outdent()
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'Second line');
      })
      .run(done);
  });

  it('outdent at selection', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(15, 16)  // Seco|n|d
          .indent()
          .outdent()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'n');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'Second line');
      })
      .run(done);
  });

  it('outdent multiline', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(8, 14)    // First li|ne Sec|ond
          .indent()
          .indent()
          .outdent()
          .outdent()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'ne\nSec');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.text, 'First line\nSecond line');
      })
      .run(done);
  });

});
