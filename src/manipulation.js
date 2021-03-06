'use strict';

var ZenArea = require('./zenarea')
  , utils = require('./utils');

/**
 * Inserts specified `text` into current caret position.
 * If text is selected, it will be overwritten.
 *
 * If `preserveSelection` is specified, user selection
 * will be recreated around newly inserted text.
 * Otherwise the caret is moved to the end of newly inserted text.
 */
ZenArea.prototype.insertText = function (text, preserveSelection) {
  var sel = this.selection
    , el = this._textarea;
  if (typeof window.chrome != 'undefined') {
    document.execCommand('insertText', null, text);
  } else {
    var value = el.value;
    el.value = value.substring(0, sel.start) + text + value.substring(sel.end);
  }
  if (preserveSelection)
    this.select(sel.start, sel.start + text.length);
  else
    this.select(sel.start + text.length);
  return this.focus();
};

/**
 * Deletes currently selected text.
 */
ZenArea.prototype.deleteText = function () {
  return this.insertText('', false);
};

/**
 * Prepends specified `indentation` (two spaces by default) to each selected line,
 * preserving the original selection.
 *
 * If user selection is empty, just inserts `indentation` at caret position.
 */
ZenArea.prototype.indent = function (indentation) {
  if (indentation == null)
    indentation = '  ';
  var origSel = this.selection
    , value = this.value;
  if (!origSel.length)
    return this.insertText(indentation);
  // Expand up to line start
  var sel = {
    start: Math.max(0, value.lastIndexOf('\n', origSel.start - 1) + 1),
    end: origSel.end
  };
  sel.value = value.substring(sel.start, sel.end);
  // Add indentation
  sel.newValue = sel.value.replace(/^/gm, indentation);
  // Recalc selection
  sel.newStart = origSel.start + indentation.length;
  sel.newEnd = origSel.end + sel.newValue.length - sel.value.length;
  // Apply new stuff
  this.select(sel.start, sel.end);
  this.insertText(sel.newValue);
  this.select(sel.newStart, sel.newEnd);
  return this.focus();
};

/**
 * Removes specified `indentation` (two spaces by default) from the start of
 * each selected line, preserving the original selection.
 */
ZenArea.prototype.outdent = function (indentation) {
  if (indentation == null)
    indentation = '  ';
  var origSel = this.selection
    , value = this.value;
  // Expand up to line start
  var sel = {
    start: Math.max(0, value.lastIndexOf('\n', origSel.start - 1) + 1),
    end: origSel.end
  };
  sel.value = value.substring(sel.start, sel.end);
  sel.newValue = sel.value;
  // Remove indentation
  function removeIndentPortion(str, index) {
    for (var i = 0; i < indentation.length; i++)
      if (str.charAt(index) == indentation.charAt(i))
        str = str.substring(0, index) + str.substring(index + 1);
      else break;
    return str;
  }
  // First, remove a portion on first line and remember the difference
  // to shift selection start accordingly.
  sel.newValue = removeIndentPortion(sel.newValue, 0);
  sel.newStart = origSel.start - (sel.value.length - sel.newValue.length);
  // Now remove other indents
  var i = sel.newValue.indexOf('\n');
  while (i != -1 && i < sel.newValue.length) {
    sel.newValue = removeIndentPortion(sel.newValue, i + 1);
    i = sel.newValue.indexOf('\n', i + 1);
  }
  // Recalc selection
  sel.newEnd = origSel.end - (sel.value.length - sel.newValue.length);
  // Apply new stuff
  this.select(sel.start, sel.end);
  this.insertText(sel.newValue);
  this.select(sel.newStart, sel.newEnd);
  return this.focus();
};

/**
 * Surrounds currently selected text with `prefix` and `suffix` strings,
 * extending the selection over inserted characters.
 *
 * If `toggle` is specified and currently selected text appears to be
 * already surrounded, remove `suffix` and `prefix` instead.
 */
ZenArea.prototype.surround = function (prefix, suffix, toggle) {
  var sel = this.selection;
  var surrounded = utils.startsWith(sel.value, prefix) &&
    utils.endsWith(sel.value, suffix);
  if (toggle && surrounded) {
    sel.value = sel.value.substring(prefix.length, sel.value.length - suffix.length);
  } else {
    sel.value = prefix + sel.value + suffix;
  }
  return this.insertText(sel.value, true);
};

/**
 * Removes currently selected lines entirely, trying to position
 * the caret exactly below its original position.
 */
ZenArea.prototype.deleteCurrentLines = function () {
  var sel = this.selection
    , value = this.value;
  // Determine an offset from line start to preserve it when lines are removed
  var lineStart = Math.max(0, value.lastIndexOf('\n', sel.start - 1) + 1)
    , offset = sel.start - lineStart;
  // Select the lines and remove them
  var lines = this.getCurrentLines();
  if (lines.end < value.length) // also remove next line break
    lines.end += 1;
  this.select(lines.start, lines.end).deleteText();
  // Reposition the caret
  sel = this.selection;
  value = this.value;
  var i = value.indexOf('\n', sel.start);
  i = Math.min(sel.start + offset, i == -1 ? value.length : i);
  return this.select(i, i);
};

/**
 * Duplicates selection or, if nothing is selected, duplicates current line instead.
 */
ZenArea.prototype.duplicate = function () {
  var sel = this.selection;
  if (!sel.length) {    // duplicate current line
    var line = this.getCurrentLines();
    return this.select(line.end)
      .insertText('\n' + line.value)
      .select(sel.start + line.value.length + 1);
  }
  return this.select(sel.end)
    .insertText(sel.value, true);
};
