'use strict';

var events = require('./events')
  , utils = require('./utils');

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

/**
 * Retrieves the textarea value.
 */
Object.defineProperty(ZenArea.prototype, 'value', {
  get: function () {
    return this._textarea.value;
  }
});

/**
 * Returns focus to textarea.
 */
ZenArea.prototype.focus = function () {
  this._textarea.focus();
  return this;
};

/**
 * Attaches event listeners (e.g. `keydown`) listed in `src/events` module.
 */
ZenArea.prototype.init = function () {
  var textarea = this._textarea;
  Object.keys(events).forEach(function (eventName) {
    textarea.addEventListener(eventName, events[eventName]);
  });
};

/**
 * Removes event listeners previously bound by `init`.
 */
ZenArea.prototype.destroy = function () {
  var textarea = this._textarea;
  Object.keys(events).forEach(function (eventName) {
    textarea.removeEventListener(eventName, events[eventName]);
  });
};

/**
 * Binds specified `command` to be executed when specified `key`
 * combination is pressed.
 *
 * The `key` expression is a human-readable string like `Shift + A`,
 * `Ctrl + Shift + Ins`, `Meta + S`, etc.
 *
 * The `command` is simply a method name, which must be exposed on
 * the ZenArea instance (by adding it to `ZenArea.prototype` or directly
 * to the instance).
 *
 * Optional `args` is an array of arguments to pass to specified method.
 */
ZenArea.prototype.bind = function (key, command, args) {
  var binding = utils.parseKey(key);
  binding.command = command;
  binding.args = Array.isArray(args) ? args : [];
  this._keyBindings[utils.normalizeName(binding)] = binding;
  return this;
};

require('./getters');
require('./selection');
require('./search');
require('./manipulation');
