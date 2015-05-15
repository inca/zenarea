'use strict';

var ZenArea = require('./zenarea')
  , utils = require('./utils');

/**
 * Getter methods return selection data without altering current
 * user selection.
 *
 * All getters return selection-like objects with `start`, `end`, `length`
 * and `value` keys, just like `getSelection`.
 */

/**
 * Returns a selection object for a substring between specified indices.
 */
ZenArea.prototype.get = function (start, end) {
  return {
    start: start,
    end: end,
    length: end - start,
    value: this.value.substring(start, end)
  };
};

/**
 * Returns lines between `start` (inclusively) and `end` (exclusively)
 * zero-based indices.
 *
 * If `start` == `end` returns a zero-length selection at the start
 * of this line.
 */
ZenArea.prototype.getLines = function (start, end) {
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
      return this.get(value.length, value.length);
  }
  var startIndex = index;
  // Find end index
  for (i = 0; i < (end - start); i++) {
    index = value.indexOf('\n', index) + 1;
    if (!index) // EOF
      return this.get(startIndex, value.length);
  }
  return this.get(startIndex, start == end ? index : index - 1);
};

/**
 * Returns a selection for the whole lines spanned by current user selection.
 */
ZenArea.prototype.getCurrentLines = function () {
  var value = this.value
    , sel = this.selection;
  sel.start = Math.max(0, value.lastIndexOf('\n', sel.start - 1) + 1);
  sel.end = Math.min(value.length, value.indexOf('\n', sel.end));
  if (sel.end == -1)
    sel.end = value.length;
  return this.get(sel.start, sel.end);
};

/**
 * Returns a selection expanded to the left of current user selection
 * until predicate function `predicate(selection)` returns true,
 * or until the start of input is reached.
 */
ZenArea.prototype.getExpandedLeft = function (predicate) {
  var sel = this.selection;
  while (!predicate(sel) && sel.start > 0) {
    sel = this.get(sel.start - 1, sel.end);
  }
  return sel;
};

/**
 * Returns a selection expanded to the right of current user selection
 * until predicate function `predicate(selection)` returns true,
 * or until the end of input is reached.
 */
ZenArea.prototype.getExpandedRight = function (predicate) {
  var value = this.value;
  var sel = this.selection;
  while (!predicate(sel) && sel.end < value.length) {
    sel = this.get(sel.start, sel.end + 1);
  }
  return sel;
};

/**
 * Returns a user selection expanded to the boundaries of currently selected
 * word, or, if at least one whole word is selected, to the boundaries of
 * current lines.
 */
ZenArea.prototype.getExpanded = function () {
  var value = this.value
    , sel = this.selection
    , prev = value.charAt(sel.start - 1)
    , next = value.charAt(sel.end);
  // See if whole line(s) selected
  if (utils.isEmptyOrNewline(prev) && utils.isEmptyOrNewline(next))
    return this.get(0, value.length);
  // See if whole word is selected
  if (utils.isEmptyOrBoundary(prev) && utils.isEmptyOrBoundary(next))
    return this.getCurrentLines();
  // Expand to word boundaries
  var selLeft = this.getExpandedLeft(function (sel) {
    return utils.isEmptyOrBoundary(value.charAt(sel.start - 1));
  });
  var selRight = this.getExpandedRight(function (sel) {
    return utils.isEmptyOrBoundary(value.charAt(sel.end));
  });
  return this.get(selLeft.start, selRight.end);
};
