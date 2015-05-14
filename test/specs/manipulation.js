'use strict';

var navit = require('navit')
  , assert = require('chai').assert;

describe('Manipulation API', function () {

  var browser = navit({
    prefix: 'http://localhost:12345'
  });

  before(function (done) {
    browser.run(done);
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
        assert.equal(selection.value, 'World');
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
        assert.equal(selection.value, 'Secon  d line');
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
        assert.equal(selection.value, 'n');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, '  Second line');
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
        assert.equal(selection.value, 'ne\n  Sec');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, '  First line\n  Second line');
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
        assert.equal(selection.value, 'Second line');
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
        assert.equal(selection.value, 'n');
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
        assert.equal(selection.value, 'ne\nSec');
      })
      .get.evaluate(function () {
        return window._ta
          .selectCurrentLines()
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'First line\nSecond line');
      })
      .run(done);
  });

  it('surround', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._ta
          .setSelection(6, 10)    // First |line|
          .surround('“', '”')
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, '“line”');
      })
      .get.evaluate(function () {
        return window._ta
          .surround('“', '”')   // Augments quotes
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, '““line””');
      })
      .get.evaluate(function () {
        return window._ta
          .surround('“', '”', true)   // De-surround
          .surround('“', '”', true)   // De-surround
          .getSelection();
      }, function (selection) {
        assert.equal(selection.value, 'line');
      })
      .run(done);
  });

});
