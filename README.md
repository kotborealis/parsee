![parsee](https://raw.githubusercontent.com/kotborealis/parsee/298dbd4f5a20f8c7a067c03db6f78ca0c94d4835/parsee.png)

# Parse

Smol node.js tool to parse command line style arguments

## Usage

### General

```js
const parsee = require('parsee');

const cmd = parsee('cmd_name', /* list of required arguments */ [
    parsee.type.string, // this command required a string,
    parsee.type.number, // a number,
    [parsee.type.url] // and, optionally, a url
]);

cmd('cmd_name "ayy lmao" 1 https://github.com/');
/* returns
[ 'ayy lmao', // type.string
  1, //type.number
  'https://github.com/', //type.url
  [type.string]: [ 'ayy lmao' ], // Arguments, but mapped to types
  [type.number]: [ 1 ],
  [type.url]: [ 'https://github.com/' ]]
*/

cmd('cmd_name "ayy lmao" 1');
/* returns
[ 'ayy lmao', // type.string
  1, //type.number
  // no url here, because it's optional
  [type.string]: [ 'ayy lmao' ], // Arguments, but mapped to types
  [type.number]: [ 1 ],
  [type.url]: []] // no url here either
*/

cmd('cmd_name "no, this isn\'t a valid arguments');
/* returns false */
```

### Strict and non-strict

```js
const cmd_non_strict = parsee('non_strict', [parsee.type.number, parsee.type.string], {strict: false}); // non-strict by default

// For non-strict commands, you can specify arguments in any order
// cmd_non_strict('non_strict 1 str') ~~~ cmd_non_strict('non_strict str 1')

const cmd_strict = parsee('strict', [parsee.type.number, parsee.type.string], {strict: true});

// For strict commands, you must specify arguments in specified order
// cmd_strict('strict str 1') === false

```

### Enum and regex-defined types

```js
const t_enum_left_or_right = parsee.type.enum('left', 'right');
// Matches only 'left' or 'right' strings

const t_regex_defined_left_or_right = parsee.type.regex_defined(/left|right/);
// Matches only strings that match regex

const cmd_turn_enum = parsee('turn', [t_enum_left_or_right]);
cmd_turn_enum('turn left');
/* returns
[ 'left',
  [t_enum_left_or_right]: [ 'left' ] ]
*/

const cmd_turn_regex = parsee('turn', [t_regex_defined_left_or_right]);
cmd_turn_regex('turn right');
/* returns
[ [ 'right', index: 0, input: 'right' ],
  [t_regex_defined_left_or_right]: [ [ 'right', index: 0, input: 'right' ] ] ]
*/

// cmd_turn_enum('turn AAAAAAA') === cmd_turn_regex('turn FFFFFF') === false;
```

### Rest argument

```js
// To get string that comes after all arguments, you can use parsee.type.rest

const cmd_rest = parsee('/kick', [parsee.type.rest]);
cmd_rest('/kick Arar rar!');
/* returns
[ 'Arar rar!', [parsee.type.rest]: [ 'Arar rar!' ] ]
*/

// parsee.type.rest argument **must** be the last argument
```
