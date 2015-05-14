# Zen Area — textarea with inner power

_This is a work in progress. Stay tuned for 1.x.x releases!_

This tiny (~15Kb minified) framework-agnostic library
provides fluent cross-browser API for textarea manipulation
and binding commands to keyboard.

Add a few lines of code:

```js
new ZenArea(document.querySelector('textarea'))
  .command('Tab', 'indent')
  .command('Shift + Tab', 'outdent');
```

Congrats, you've just trained your textarea to indent selected lines
with <kbd>Tab</kbd> and remove indentation with <kbd>Shift</kbd>+<kbd>Tab</kbd>.

## Features

* Vanilla JavaScript, no dependencies
* Compatible with Browserify and RequireJS/AMD
* No custom/shadow elements — only textarea and your imagination

## Commands



## License

ISC / Boris Okunskiy

