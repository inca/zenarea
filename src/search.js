'use strict';

var ZenArea = require('./zenarea');

/**
 * Selects first match of regular expression, starting at
 * specified `index` (or from the start if not provided).
 * The `g` flag of regex is ignored; however, you can use
 * it in conjunction with `regex.lastIndex` to work with
 * all occurrences.
 *
 * If regex does not match, do not alter the selection.
 */
ZenArea.prototype.find = function (regex, index) {
  index = index || 0;
  var area = this.value.substring(index);
  var match = regex.exec(area);
  if (match)
    return this.setSelection(index + match.index,
        index + match.index + match[0].length);
  return this.focus();
};

/**
 * Like `find`, but start at the end of current user selection.
 */
ZenArea.prototype.findNext = function (regex) {
  var sel = this.getSelection();
  return this.find(regex, sel.end);
};

/**
 * Selects first match of `regex` and replaces it with `replacement`,
 * starting at specified `index` (or from the start if not provided).
 */
ZenArea.prototype.replace = function (regex, replacement, index) {
  this.find(regex, index);
  var sel = this.getSelection();
  if (regex.test(sel.value))  // Ensure we have found it
    return this.insertText(replacement, true);
  return this.focus();
};

/**
 * Like `replace`, but start at the end of current user selection.
 */
ZenArea.prototype.replaceNext = function (regex, replacement) {
  var sel = this.getSelection();
  return this.replace(regex, replacement, sel.end);
};

/**
 * Search for all occurrences of `regex` and replace them with `replacement`.
 *
 * User selection is positioned at the end of input.
 */
ZenArea.prototype.replaceAll = function (regex, replacement) {
  return this.selectAll()
    .insertText(this.value.replace(regex, replacement));
};
