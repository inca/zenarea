'use strict';

var TextArea = require('./index')
  , utils = require('./utils');

/**
 * Inserts specified `text` into current caret position.
 * If text is selected, it will be overwritten.
 *
 * If `preserveSelection` is specified, user selection
 * will be recreated around newly inserted text.
 * Otherwise the caret is moved to the end of newly inserted text.
 */
TextArea.prototype.insertText = function (text, preserveSelection) {
  var el = this._textarea
    , sel = this.getSelection()
    , event = document.createEvent('TextEvent');
  if (typeof event.initTextEvent == 'function') {
    event.initTextEvent('textInput', true, true, null, text);
    el.dispatchEvent(event);
  } else {
    var value = el.value;
    el.value = value.substring(0, sel.start) + text + value.substring(sel.end);
  }
  if (preserveSelection)
    this.setSelection(sel.start, sel.start + text.length);
  else
    this.setSelection(sel.start + text.length);
  return this.focus();
};

/**
 * Prepends specified `indentation` (two spaces by default) to each selected line,
 * preserving the original selection.
 *
 * If user selection is empty, just inserts `indentation` at caret position.
 */
TextArea.prototype.indent = function (indentation) {
  if (indentation == null)
    indentation = '  ';
  var origSel = this.getSelection()
    , value = this.value;
  if (!origSel.length)
    return this.insertText(indentation);
  // Expand up to line start
  var sel = {
    start: Math.max(0, value.lastIndexOf('\n', origSel.start - 1) + 1),
    end: origSel.end
  };
  sel.text = value.substring(sel.start, sel.end);
  // Add indentation
  sel.newText = sel.text.replace(/^/gm, indentation);
  // Recalc selection
  sel.newStart = origSel.start + indentation.length;
  sel.newEnd = origSel.end + sel.newText.length - sel.text.length;
  // Apply new stuff
  this.setSelection(sel.start, sel.end);
  this.insertText(sel.newText);
  this.setSelection(sel.newStart, sel.newEnd);
  return this.focus();
};

/**
 * Removes specified `indentation` (two spaces by default) from the start of
 * each selected line, preserving the original selection.
 */
TextArea.prototype.outdent = function (indentation) {
  if (indentation == null)
    indentation = '  ';
  var origSel = this.getSelection()
    , value = this.value;
  // Expand up to line start
  var sel = {
    start: Math.max(0, value.lastIndexOf('\n', origSel.start - 1) + 1),
    end: origSel.end
  };
  sel.text = value.substring(sel.start, sel.end);
  sel.newText = sel.text;
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
  sel.newText = removeIndentPortion(sel.newText, 0);
  sel.newStart = origSel.start - (sel.text.length - sel.newText.length);
  // Now remove other indents
  var i = sel.newText.indexOf('\n');
  while (i != -1 && i < sel.newText.length) {
    sel.newText = removeIndentPortion(sel.newText, i + 1);
    i = sel.newText.indexOf('\n', i + 1);
  }
  // Recalc selection
  sel.newEnd = origSel.end - (sel.text.length - sel.newText.length);
  // Apply new stuff
  this.setSelection(sel.start, sel.end);
  this.insertText(sel.newText);
  this.setSelection(sel.newStart, sel.newEnd);
  return this.focus();
};

/**
 * Surrounds currently selected text with `prefix` and `suffix` strings,
 * extending the selection over inserted characters.
 *
 * If `toggle` is specified and currently selected text appears to be
 * already surrounded, remove `suffix` and `prefix` instead.
 */
TextArea.prototype.surround = function (prefix, suffix, toggle) {
  var sel = this.getSelection();
  var surrounded = utils.startsWith(sel.text, prefix) &&
    utils.endsWith(sel.text, suffix);
  if (toggle && surrounded) {
    sel.text = sel.text.substring(prefix.length, sel.text.length - suffix.length);
  } else {
    sel.text = prefix + sel.text + suffix;
  }
  return this.insertText(sel.text, true);
};
