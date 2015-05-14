'use strict';

var assert = require('chai').assert
  , utils = require('../../src/utils');

describe('Key parser', function () {

  it('parse simple alphanumeric', function () {
    var a = utils.parseKey('A');
    assert.equal(a.name, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse shift modifier', function () {
    var a = utils.parseKey('Shift + A');
    assert.equal(a.name, 'a');
    assert.equal(a.code, 65);
    assert.ok(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse ctrl modifier', function () {
    var a = utils.parseKey('Ctrl + A');
    assert.equal(a.name, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.ok(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse alt modifier', function () {
    var a = utils.parseKey('Alt + A');
    assert.equal(a.name, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.ok(a.alt);
  });

  it('parse mixed modifiers', function () {
    var a = utils.parseKey('Ctrl + Alt + A');
    assert.equal(a.name, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.ok(a.ctrl);
    assert.ok(a.alt);
    a = utils.parseKey('Meta + Shift + A');
    assert.equal(a.name, 'a');
    assert.equal(a.code, 65);
    assert.ok(a.shift);
    assert.ok(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse tab', function () {
    var a = utils.parseKey('Shift + Tab');
    assert.equal(a.name, 'tab');
    assert.equal(a.code, 9);
    assert.ok(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse escape', function () {
    var a = utils.parseKey('Ctrl + Esc');
    assert.equal(a.name, 'esc');
    assert.equal(a.code, 27);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.ok(a.ctrl);
    assert.notOk(a.alt);
  });

});
