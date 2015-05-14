'use strict';

var events = require('./events');

var ZenArea = module.exports = exports = function (textarea) {
  if (!(this instanceof ZenArea))
    return new ZenArea(textarea);
  // Unwrap jQuery, NodeList and other wrappers
  this._textarea = textarea[0] || textarea;
  if (!this._textarea instanceof HTMLTextAreaElement)
    throw new Error('Pass valid <textarea> to ZenArea constructor.');
  // Mount this instance onto DOM node (yes, we did this)
  this._textarea._zen = this;
  // Key bindings
  this._keyBindings = {};
  // Initialize on instantiation
  this.init();
};

Object.defineProperty(ZenArea.prototype, 'value', {
  get: function () {
    return this._textarea.value;
  }
});

ZenArea.prototype.focus = function () {
  this._textarea.focus();
  return this;
};

ZenArea.prototype.init = function () {
  var textarea = this._textarea;
  Object.keys(events).forEach(function (eventName) {
    textarea.addEventListener(eventName, events[eventName]);
  });
};

ZenArea.prototype.destroy = function () {
  var textarea = this._textarea;
  Object.keys(events).forEach(function (eventName) {
    textarea.removeEventListener(eventName, events[eventName]);
  });
};

require('./selection');
require('./search');
require('./manipulation');
require('./command');
