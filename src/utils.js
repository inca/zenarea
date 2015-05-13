'use strict';

exports.isBoundary = function (char) {
  var code = char.charCodeAt(0);
  return (code <= 0x2F) ||
    (code >= 0x3A && code <= 0x3F) ||
    (code >= 0x5B && code <= 0x60) ||
    (code >= 0x7B && code <= 0xBF) ||
    (code >= 0x2000 && code <= 0x206F) ||
    (code >= 0x2190 && code <= 0x22FF);
};

exports.isEmptyOrBoundary = function (char) {
  return char == '' || exports.isBoundary(char);
};

exports.isEmptyOrNewline = function (char) {
  return char == '' || char == '\n';
};

exports.containsBoundaries = function (str) {
  for (var i = 0; i < str.length; i++)
    if (exports.isBoundary(str.charAt(i)))
      return true;
  return false;
};

exports.countChars = function (str, substr) {
  var count = 0;
  var i = str.indexOf(substr);
  while (i != -1) {
    count += 1;
    i = str.indexOf(substr, i + substr.length);
  }
  return count;
};
