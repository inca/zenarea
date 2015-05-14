'use strict';

var events = require('./events');

var TextArea = module.exports = exports = function (textarea) {
  if (!(this instanceof TextArea))
    return new TextArea(textarea);
  // Unwrap jQuery, NodeList and other wrappers
  this._textarea = textarea[0] || textarea;
  if (!this._textarea instanceof HTMLTextAreaElement)
    throw new Error('Pass valid <textarea> to TextArea constructor.');
  // Mount this instance onto DOM node (yes, we did this)
  this._textarea._textarea = this;
  // Key bindings
  this._keyBindings = {};
  // Initialize on instantiation
  this.init();
};

Object.defineProperty(TextArea.prototype, 'value', {
  get: function () {
    return this._textarea.value;
  }
});

TextArea.prototype.focus = function () {
  this._textarea.focus();
  return this;
};

TextArea.prototype.init = function () {
  var textarea = this._textarea;
  Object.keys(events).forEach(function (eventName) {
    textarea.addEventListener(eventName, events[eventName]);
  });
};

TextArea.prototype.destroy = function () {
  var textarea = this._textarea;
  Object.keys(events).forEach(function (eventName) {
    textarea.removeEventListener(eventName, events[eventName]);
  });
};

require('./selection');
require('./search');
require('./manipulation');
require('./command');
