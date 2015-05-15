'use strict';

var navit = require('navit')
  , assert = require('chai').assert;

describe('Selection API', function () {

  var browser = navit({
    prefix: 'http://localhost:12345'
  });

  before(function (done) {
    browser.run(done);
  });

  it('select', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(11, 22)
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 11);
        assert.equal(selection.end, 22);
        assert.equal(selection.value, 'Second line');
      })
      .get.evaluate(function () {
        return window._z
          .select(16)
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 16);
        assert.equal(selection.end, 16);
        assert.equal(selection.value, '');
      })
      .run(done);
  });

  it('selectAll', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .selectAll()
          .selection;
      }, function (selection) {
        assert.equal(selection.length, 44);
      })
      .run(done);
  });

  it('selectLines', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .selectLines(1, 2)
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'Second line');
      })
      .get.evaluate(function () {
        return window._z
          .selectLines(1, 1)
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 11);
        assert.equal(selection.end, 11);
      })
      .get.evaluate(function () {
        return window._z
          .selectLines(0, 3)
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'First line\nSecond line\nThird line');
      })
      .run(done);
  });

  it('selectCurrentLines', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(16)     // Caret is on the second line
          .selectCurrentLines()
          .selectCurrentLines() // Calling repeatedly does not affect selection
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 11);
        assert.equal(selection.end, 22);
        assert.equal(selection.length, 11);
      })
      .get.evaluate(function () {
        return window._z
          .select(1, 2)    // Selection spans first line
          .selectCurrentLines()
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 0);
        assert.equal(selection.end, 10);
        assert.equal(selection.length, 10);
      })
      .run(done);
  });

  it('selectLeft', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(16)
          .selectLeft(function (sel) {
            return sel.value.length == 4;
          })
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 12);
        assert.equal(selection.end, 16);
        assert.equal(selection.length, 4);
      })
      .run(done);
  });

  it('selectRight', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(16)
          .selectRight(function (sel) {
            return sel.value.length == 4;
          })
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 16);
        assert.equal(selection.end, 20);
        assert.equal(selection.length, 4);
      })
      .run(done);
  });

  it('expandSelection', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(14, 16)       // Sec|on|d ...
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'Second');
      })
      .get.evaluate(function () {
        return window._z
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'Second line');
      })
      .get.evaluate(function () {
        return window._z
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 0);
        assert.equal(selection.length, 44);
      })
      .run(done);
  });

  it('expandSelection (cornercase on start)', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(0)
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'First');
      })
      .get.evaluate(function () {
        return window._z
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'First line');
      })
      .get.evaluate(function () {
        return window._z
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 0);
        assert.equal(selection.length, 44);
      })
      .run(done);
  });

  it('expandSelection (cornercase on end)', function (done) {
    browser.open('/simple.html')
      .get.evaluate(function () {
        return window._z
          .select(44)
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'block');
      })
      .get.evaluate(function () {
        return window._z
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.value, 'New block');
      })
      .get.evaluate(function () {
        return window._z
          .expandSelection()
          .selection;
      }, function (selection) {
        assert.equal(selection.start, 0);
        assert.equal(selection.length, 44);
      })
      .run(done);
  });


});
