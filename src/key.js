'use strict';

var NAMES = {
  8: ['backspace'],
  9: ['tab'],
  13: ['enter'],
  19: ['pause', 'break'],
  20: ['caps', 'caps-lock', 'capslock'],
  27: ['esc', 'escape'],
  32: ['space'],
  33: ['pageup', 'page-up'],
  34: ['pagedown', 'page-down'],
  35: ['end'],
  36: ['home'],
  37: ['left', 'arrow-left'],
  38: ['up', 'arrow-up'],
  39: ['right', 'arrow-right'],
  40: ['down', 'arrow-down'],
  45: ['ins', 'insert'],
  46: ['del', 'delete'],
  48: ['0'],
  49: ['1'],
  50: ['2'],
  51: ['3'],
  52: ['4'],
  53: ['5'],
  54: ['6'],
  55: ['7'],
  56: ['8'],
  57: ['9'],
  65: ['a'],
  66: ['b'],
  67: ['c'],
  68: ['d'],
  69: ['e'],
  70: ['f'],
  71: ['g'],
  72: ['h'],
  73: ['i'],
  74: ['j'],
  75: ['k'],
  76: ['l'],
  77: ['m'],
  78: ['n'],
  79: ['o'],
  80: ['p'],
  81: ['q'],
  82: ['r'],
  83: ['s'],
  84: ['t'],
  85: ['u'],
  86: ['v'],
  87: ['w'],
  88: ['x'],
  89: ['y'],
  90: ['z'],
  93: ['select', 'menu'],
  96: ['num0'],
  97: ['num1'],
  98: ['num2'],
  99: ['num3'],
  100: ['num4'],
  101: ['num5'],
  102: ['num6'],
  103: ['num7'],
  104: ['num8'],
  105: ['num9'],
  106: ['num*'],
  107: ['num+'],
  109: ['num-'],
  110: ['num.'],
  111: ['num/'],
  112: ['f1'],
  113: ['f2'],
  114: ['f3'],
  115: ['f4'],
  116: ['f5'],
  117: ['f6'],
  118: ['f7'],
  119: ['f8'],
  120: ['f9'],
  121: ['f10'],
  122: ['f11'],
  123: ['f12'],
  144: ['num-lock', 'numlock'],
  145: ['scroll-lock', 'scrolllock'],
  186: [';', 'semicolon'],
  187: ['=', 'equal'],
  188: [',', 'comma'],
  189: ['-', 'minus', 'dash'],
  190: ['.', 'period', 'dot'],
  191: ['/', 'slash'],
  192: ['`', 'grave'],
  219: ['['],
  220: ['\\', 'backslash'],
  221: [']'],
  222: ['\'']
};

var CODES = {};

Object.keys(NAMES).forEach(function (code) {
  var names = NAMES[code];
  names.forEach(function (name) {
    CODES[name] = code;
  });
});

exports.parse = function (expr) {
  var result = {
    meta: false,
    ctrl: false,
    shift: false,
    alt: false
  };
  expr = expr.replace(/(?:meta|win|cmd|command)\s*\+\s*/gi, function () {
    result.meta = true;
    return '';
  });
  expr = expr.replace(/(?:ctrl|control|ctl)\s*\+\s*/gi, function () {
    result.ctrl = true;
    return '';
  });
  expr = expr.replace(/shift\s*\+\s*/gi, function () {
    result.shift = true;
    return '';
  });
  expr = expr.replace(/(?:alt|option)\s*\+\s*/gi, function () {
    result.alt = true;
    return '';
  });
  expr = expr.trim().toLowerCase();
  var code = CODES[expr];
  if (code == null)
    return result;
  result.code = code;
  result.key = NAMES[code][0];
  return result;
};
