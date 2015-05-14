'use strict';

var utils = require('./utils');

/**
 * Events listeners which are hooked up on TextArea instantiation.
 *
 * Use `destroy()` method to unbind them, or `init()` to bind them again.
 */
module.exports = exports = {

  keydown: function (ev) {
    var _ta = this._textarea;
    var name = utils.normalizeName({
      name: utils.codeToKey(ev.keyCode),
      meta: ev.metaKey,
      ctrl: ev.ctrlKey,
      shift: ev.shiftKey,
      alt: ev.altKey
    });
    var binding = _ta._keyBindings[name];
    if (!binding)
      return true;
    var cmd = binding.command;
    if (typeof cmd == 'string')
      cmd = _ta[cmd];
    if (typeof cmd == 'function') {
      ev.preventDefault();
      ev.stopPropagation();
      cmd.apply(_ta, binding.args);
      return false;
    }
    return true;
  }

};
