'use strict';

var utils = require('./utils');

/**
 * Events listeners which are hooked up on ZenArea instantiation.
 *
 * Use `destroy()` method to unbind them, or `init()` to bind them again.
 */
module.exports = exports = {

  keydown: function (ev) {
    var z = this._zen;
    var name = utils.normalizeName({
      name: utils.codeToKey(ev.keyCode),
      meta: ev.metaKey,
      ctrl: ev.ctrlKey,
      shift: ev.shiftKey,
      alt: ev.altKey
    });
    var binding = z._keyBindings[name];
    if (!binding)
      return true;
    var cmd = binding.command;
    if (typeof cmd == 'string')
      cmd = z[cmd];
    if (typeof cmd == 'function') {
      ev.preventDefault();
      ev.stopPropagation();
      cmd.apply(z, binding.args);
      return false;
    }
    return true;
  }

};
