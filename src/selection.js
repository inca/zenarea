'use strict';

var TextArea = require('./index');

TextArea.prototype.getSelection = function () {
  var el = this._textarea;
  var start = el.selectionStart;
  var end = el.selectionEnd;
  if (typeof start == "number" && typeof start == "number")
    return {
      start: start,
      end: end,
      text: el.value.substring(start, end)
    };
  // The IE part, revisited version of
  // http://stackoverflow.com/questions/3053542#3053640
  var range = document.selection.createRange();
  // Focus must be set on textarea for this to work
  el.focus();
  // Now the magic begins
  var len = el.value.length;
  var normalizedValue = el.value.replace(/\r\n/g, "\n");
  // Create a working TextRange that lives only in the input
  var textInputRange = el.createTextRange();
  textInputRange.moveToBookmark(range.getBookmark());
  // Check if the start and end of the selection are at the very end
  // of the input, since moveStart/moveEnd doesn't return what we want
  // in those cases
  var endRange = el.createTextRange();
  endRange.collapse(false);
  if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
    start = end = len;
  } else {
    start = -textInputRange.moveStart("character", -len);
    start += normalizedValue.slice(0, start).split("\n").length - 1;
    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
      end = len;
    } else {
      end = -textInputRange.moveEnd("character", -len);
      end += normalizedValue.slice(0, end).split("\n").length - 1;
    }
  }
  return {
    start: start,
    end: end,
    text: el.value.substring(start, end)
  };
};

TextArea.prototype.setSelection = function (start, end) {
  var el = this._textarea;
  el.focus();
  if (el.setSelectionRange) {
    el.setSelectionRange(start, end);
  } else if (el.createTextRange) {
    el = el.createTextRange();
    el.collapse(true);
    el.moveEnd('character', end);
    el.moveStart('character', start);
    el.select();
  }
  return this;
};
