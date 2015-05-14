'use strict';

var ZenArea = require('./zenarea')
  , utils = require('./utils');

/**
 * Binds specified `command` to be executed when specified `key` is
 * pressed.
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
ZenArea.prototype.command = function (key, command, args) {
  var binding = utils.parseKey(key);
  binding.command = command;
  binding.args = Array.isArray(args) ? args : [];
  this._keyBindings[utils.normalizeName(binding)] = binding;
  return this;
};
