'use strict';

var TextArea = require('./index');

/**
 * Returns a selection object containing `start`, `end`, `length` and `text`
 * properties of current user selection within textarea.
 *
 * Addresses all the weirdness of IE.
 */
TextArea.prototype.getSelection = function () {
  var el = this._textarea
    , start = el.selectionStart
    , end = el.selectionEnd;
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

/**
 * Expands user selection to span currently selected lines.
 */
TextArea.prototype.selectCurrentLines = function () {
  var el = this._textarea
    , value = el.value
    , sel = this.getSelection();
  sel.start = Math.max(0, value.lastIndexOf('\n', sel.start) + 1);
  sel.end = Math.min(value.length, value.indexOf('\n', sel.end));
  this.setSelection(sel.start, sel.end);
  return this;
};

/**
 * Expands user selection: from caret to word, from word to line,
 * from line to block, from block to everything.
 */
TextArea.prototype.expandSelection = function () {
  var sel = this.getSelection();
  if (/\n\s*?\n/.test(sel.text))     // Block is selected
    return this.selectAll();
  if (sel.text.indexOf('\n') > -1)    // Line selected
    return this.selectCurrentBlock();
  if (/\s/.test(sel.text))           // Multiple words selected
    return this.selectCurrentLines();

  return this;
};
