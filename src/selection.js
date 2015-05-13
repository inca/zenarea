'use strict';

var TextArea = require('./index');

/**
 * Returns a selection object containing `start`, `end`, `length` and `text`
 * properties of current user selection within textarea.
 *
 * Addresses all the weirdness of IE.
 */
TextArea.prototype.getSelection = function () {
  var el = this._textarea;
  var start = el.selectionStart;
  var end = el.selectionEnd;
  if (typeof start == 'number' && typeof start == 'number')
    return {
      start: start,
      end: end,
      length: end - start,
      text: el.value.substring(start, end)
    };
  // The IE part, revisited version of
  // http://stackoverflow.com/questions/3053542#3053640
  var range = document.selection.createRange();
  // Focus must be set on textarea for this to work
  el.focus();
  // Now the magic begins
  var len = el.value.length;
  var normalizedValue = el.value.replace(/\r\n/g, '\n');
  // Create a working TextRange that lives only in the input
  var textInputRange = el.createTextRange();
  textInputRange.moveToBookmark(range.getBookmark());
  // Check if the start and end of the selection are at the very end
  // of the input, since moveStart/moveEnd doesn't return what we want
  // in those cases
  var endRange = el.createTextRange();
  endRange.collapse(false);
  if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
    start = end = len;
  } else {
    start = -textInputRange.moveStart('character', -len);
    start += normalizedValue.slice(0, start).split('\n').length - 1;
    if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
      end = len;
    } else {
      end = -textInputRange.moveEnd('character', -len);
      end += normalizedValue.slice(0, end).split('\n').length - 1;
    }
  }
  return {
    start: start,
    end: end,
    text: el.value.substring(start, end)
  };
};

/**
 * Sets user selection as specified by `start` and `end` indices.
 */
TextArea.prototype.setSelection = function (start, end) {
  if (end == null)
    end = start;
  if (end < start) {
    var t = end;
    end = start;
    start = t;
  }
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

/**
 * Expands user selection to entire textarea content.
 */
TextArea.prototype.selectAll = function () {
  var el = this._textarea;
  this.setSelection(0, el.value.length);
  return this;
};

// Selection expansion stuff

/**
 * Expands user selection to span currently selected lines.
 */
TextArea.prototype.selectCurrentLines = function () {
  var el = this._textarea;
  var value = el.value;
  var sel = this.getSelection();
  sel.start = Math.max(0, value.lastIndexOf('\n', sel.start) + 1);
  sel.end = Math.min(value.length, value.indexOf('\n', sel.end));
  this.setSelection(sel.start, sel.end);
  return this;
};

/**
 * Expands user selection to the left char-by-char until passed predicate function
 * `predicate(selection)` returns true, or until the start of input is reached.
 */
TextArea.prototype.selectLeft = function (predicate) {
  var sel = this.getSelection();
  while (!predicate(sel) && sel.start > 0) {
    this.setSelection(sel.start - 1, sel.end);
    sel = this.getSelection();
  }
  return this;
};

/**
 * Expands user selection to the right char-by-char until passed predicate function
 * `predicate(selection)` returns true, or until the end of input is reached.
 */
TextArea.prototype.selectRight = function (predicate) {
  var el = this._textarea;
  var sel = this.getSelection();
  while (!predicate(sel) && sel.end < el.value.length) {
    this.setSelection(sel.start, sel.end + 1);
    sel = this.getSelection();
  }
  return this;
};
