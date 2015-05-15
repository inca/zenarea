'use strict';

var ZenArea = require('./zenarea');

/**
 * Returns a selection object containing `start`, `end`, `length` and `value`
 * properties of current user selection within textarea.
 *
 * Addresses all the weirdness of IE.
 */
Object.defineProperty(ZenArea.prototype, 'selection', {
  get: function () {
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
  }
});

/**
 * Sets user selection as specified by `start` and `end` indices.
 */
ZenArea.prototype.select = function (start, end) {
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
ZenArea.prototype.selectAll = function () {
  return this.select(0, this.value.length);
};

/**
 * Selects lines between `start` (inclusively) and `end` (exclusively)
 * zero-based indices.
 *
 * If `start` == `end`, positions caret at the start of that line.
 */
ZenArea.prototype.selectLines = function (start, end) {
  var sel = this.getLines(start, end);
  return this.select(sel.start, sel.end);
};

/**
 * Expands user selection to span currently selected lines.
 */
ZenArea.prototype.selectCurrentLines = function () {
  var sel = this.getCurrentLines();
  return this.select(sel.start, sel.end);
};

/**
 * Expands user selection to the left char-by-char until passed predicate function
 * `predicate(selection)` returns true, or until the start of input is reached.
 */
ZenArea.prototype.selectLeft = function (predicate) {
  var sel = this.getExpandedLeft(predicate);
  return this.select(sel.start, sel.end);
};

/**
 * Expands user selection to the right char-by-char until passed predicate function
 * `predicate(selection)` returns true, or until the end of input is reached.
 */
ZenArea.prototype.selectRight = function (predicate) {
  var sel = this.getExpandedRight(predicate);
  return this.select(sel.start, sel.end);
};

/**
 * Expands user selection.
 */
ZenArea.prototype.expandSelection = function () {
  var sel = this.getExpanded();
  return this.select(sel.start, sel.end);
};
