'use strict';

var assert = require('chai').assert
  , key = require('../../src/key');

describe('Key parser', function () {

  it('parse simple alphanumeric', function () {
    var a = key.parse('A');
    assert.equal(a.key, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse shift modifier', function () {
    var a = key.parse('Shift + A');
    assert.equal(a.key, 'a');
    assert.equal(a.code, 65);
    assert.ok(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse ctrl modifier', function () {
    var a = key.parse('Ctrl + A');
    assert.equal(a.key, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.ok(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse alt modifier', function () {
    var a = key.parse('Alt + A');
    assert.equal(a.key, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.ok(a.alt);
  });

  it('parse mixed modifiers', function () {
    var a = key.parse('Ctrl + Alt + A');
    assert.equal(a.key, 'a');
    assert.equal(a.code, 65);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.ok(a.ctrl);
    assert.ok(a.alt);
    a = key.parse('Meta + Shift + A');
    assert.equal(a.key, 'a');
    assert.equal(a.code, 65);
    assert.ok(a.shift);
    assert.ok(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse tab', function () {
    var a = key.parse('Shift + Tab');
    assert.equal(a.key, 'tab');
    assert.equal(a.code, 9);
    assert.ok(a.shift);
    assert.notOk(a.meta);
    assert.notOk(a.ctrl);
    assert.notOk(a.alt);
  });

  it('parse escape', function () {
    var a = key.parse('Ctrl + Esc');
    assert.equal(a.key, 'esc');
    assert.equal(a.code, 27);
    assert.notOk(a.shift);
    assert.notOk(a.meta);
    assert.ok(a.ctrl);
    assert.notOk(a.alt);
  });

});
