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
        return window._z
          .select(11, 22)  // Select second line
          .insertText('Hello, ')
          .insertText('World')
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 23);
        assert.equal(selection.length, 0);
      })
      .run(done);
  });

  it('insertText w/ preserveSelection', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(11, 22)  // Select second line
          .insertText('Hello, ', true)
          .insertText('World', true)
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 11);
        assert.equal(selection.value, 'World');
      })
      .run(done);
  });

  it('deleteText', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(14, 17)  // Sec|ond| line
          .deleteText()
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 14);
        assert.equal(selection.length, 0);
      })
      .get.evaluate(function () {
        return window._z
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'Sec line');
      })
      .run(done);
  });

  it('indent at caret', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(16)  // Secon|d
          .indent()
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'Secon  d line');
      })
      .run(done);
  });

  it('indent at selection', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(15, 16)  // Seco|n|d
          .indent()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'n');
      })
      .get.evaluate(function () {
        return window._z
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, '  Second line');
      })
      .run(done);
  });

  it('indent multiline', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(8, 14)    // First li|ne Sec|ond
          .indent()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'ne\n  Sec');
      })
      .get.evaluate(function () {
        return window._z
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, '  First line\n  Second line');
      })
      .run(done);
  });

  it('outdent at non-indented', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(16)  // Secon|d
          .outdent()
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'Second line');
      })
      .run(done);
  });

  it('outdent at selection', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(15, 16)  // Seco|n|d
          .indent()
          .outdent()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'n');
      })
      .get.evaluate(function () {
        return window._z
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'Second line');
      })
      .run(done);
  });

  it('outdent multiline', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(8, 14)    // First li|ne Sec|ond
          .indent()
          .indent()
          .outdent()
          .outdent()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'ne\nSec');
      })
      .get.evaluate(function () {
        return window._z
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'First line\nSecond line');
      })
      .run(done);
  });

  it('surround', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(6, 10)    // First |line|
          .surround('“', '”')
          .selection;
      }, function (selection) {
        assert.equal(selection.value, '“line”');
      })
      .get.evaluate(function () {
        return window._z
          .surround('“', '”')   // Augments quotes
          .selection;
      }, function (selection) {
        assert.equal(selection.value, '““line””');
      })
      .get.evaluate(function () {
        return window._z
          .surround('“', '”', true)   // De-surround
          .surround('“', '”', true)   // De-surround
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'line');
      })
      .run(done);
  });

});
