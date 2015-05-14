'use strict';

var TextArea = require('./index');

Object.defineProperty(TextArea.prototype, 'value', {
  get: function () {
    return this._textarea.value;
  }
});

TextArea.prototype.focus = function () {
  this._textarea.focus();
  return this;
};
