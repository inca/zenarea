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
  var origSel = this.getSelection();
  if (!origSel.length)
    return this.insertText(indentation);
  this.selectCurrentLines();
  var sel = this.getSelection();
  var linesCount = utils.countChars(sel.text, '\n') + 1;
  sel.text = sel.text.replace(/^/gm, indentation);
  sel.start = origSel.start + indentation.length;
  sel.end = origSel.end + linesCount * indentation.length;
  this.insertText(sel.text);
  this.setSelection(sel.start, sel.end);
  return this;
};
