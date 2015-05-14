'use strict';

var TextArea = module.exports = exports = function (textarea) {
  if (!(this instanceof TextArea))
    return new TextArea(textarea);
  // Unwrap jQuery, NodeList and other wrappers
  this._textarea = textarea[0] || textarea;
  if (!this._textarea instanceof HTMLTextAreaElement)
    throw new Error('Pass valid <textarea> to TextArea constructor.');
  // Key bindings
  this._keyBindings = {};
};

require('./core');
require('./selection');
require('./search');
require('./manipulation');
