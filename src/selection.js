'use strict';

var TextArea = require('./index')
  , utils = require('./utils');

/**
 * Returns a selection object containing `start`, `end`, `length` and `value`
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
      value: el.value.substring(start, end)
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
    length: end - start,
    value: el.value.substring(start, end)
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
  return this.focus();
};

/**
 * Expands user selection to entire textarea content.
 */
TextArea.prototype.selectAll = function () {
  this.setSelection(0, this.value.length);
  return this.focus();
};

/**
 * Selects lines between `start` (inclusively) and `end` (exclusively)
 * zero-based indices.
 *
 * If `start` == `end`, positions caret at the start of that line.
 */
TextArea.prototype.selectLines = function (start, end) {
  if (end == null)
    end = start;
  if (end < start) {
    var t = end;
    end = start;
    start = t;
  }
  var value = this.value
    , index = 0;
  // Find start index
  for (var i = 0; i < start; i++) {
    index = value.indexOf('\n', index) + 1;
    if (!index) // EOF
      return this.setSelection(value.length, value.length);
  }
  var startIndex = index;
  // Find end index
  for (i = 0; i < (end - start); i++) {
    index = value.indexOf('\n', index) + 1;
    if (!index) // EOF
      return this.setSelection(startIndex, value.length);
  }
  return this.setSelection(startIndex, start == end ? index : index - 1);
};

/**
 * Expands user selection to span currently selected lines.
 */
TextArea.prototype.selectCurrentLines = function () {
  var value = this.value
    , sel = this.getSelection();
  sel.start = Math.max(0, value.lastIndexOf('\n', sel.start - 1) + 1);
  sel.end = Math.min(value.length, value.indexOf('\n', sel.end));
  if (sel.end == -1)
    sel.end = value.length;
  this.setSelection(sel.start, sel.end);
  return this.focus();
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
  return this.focus();
};

/**
 * Expands user selection to the right char-by-char until passed predicate function
 * `predicate(selection)` returns true, or until the end of input is reached.
 */
TextArea.prototype.selectRight = function (predicate) {
  var value = this.value;
  var sel = this.getSelection();
  while (!predicate(sel) && sel.end < value.length) {
    this.setSelection(sel.start, sel.end + 1);
    sel = this.getSelection();
  }
  return this.focus();
};

/**
 * Expands user selection.
 */
TextArea.prototype.expandSelection = function () {
  var value = this.value
    , sel = this.getSelection()
    , prev = value.charAt(sel.start - 1)
    , next = value.charAt(sel.end);
  // See if whole line(s) selected
  if (utils.isEmptyOrNewline(prev) && utils.isEmptyOrNewline(next))
    return this.selectAll();
  // See if selection spans multiple words
  if (utils.containsBoundaries(sel.value))
    return this.selectCurrentLines();
  // See if whole word is selected
  if (utils.isEmptyOrBoundary(prev) && utils.isEmptyOrBoundary(next))
    return this.selectCurrentLines();
  // Expand to word boundaries
  this.selectLeft(function (sel) {
    return utils.isEmptyOrBoundary(value.charAt(sel.start - 1));
  });
  this.selectRight(function (sel) {
    return utils.isEmptyOrBoundary(value.charAt(sel.end));
  });
  return this.focus();
};
