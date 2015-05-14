'use strict';

var TextArea = require('./index');

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
  return this;
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
  return this;
};
