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

cmd('cmd_name "ayy lmao" 1 https://github.com/ some random string');
/* returns
[ 'ayy lmao', // type.string
  1, //type.number
  'https://github.com/', //type.url
  raw_args_str: ' "ayy lmao" 1 https://github.com/  some random string', // raw arguments string
  arbitrary_arg: 'some random string', // string that comes after the args
  [type.string]: [ 'ayy lmao' ], // Arguments, but mapped to types
  [type.number]: [ 1 ],
  [type.url]: [ 'https://github.com/' ]]
*/

cmd('cmd_name "ayy lmao" 1 some random string');
/* returns
[ 'ayy lmao', // type.string
  1, //type.number
  // no url here, because it's optional
  raw_args_str: ' "ayy lmao" 1 some random string', // raw arguments string
  arbitrary_arg: 'some random string', // string that comes after the args
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
  [t_enum_left_or_right]: [ 'left' ],
  raw_args_str: ' left',
  arbitrary_arg: '' ]
*/

const cmd_turn_regex = parsee('turn', [t_regex_defined_left_or_right]);
cmd_turn_regex('turn right');
/* returns
[ [ 'right', index: 0, input: 'right' ],
  [t_regex_defined_left_or_right]: [ [ 'right', index: 0, input: 'right' ] ],
  raw_args_str: ' right',
  arbitrary_arg: '' ]

// cmd_turn_enum('turn AAAAAAA') === cmd_turn_regex('turn FFFFFF') === false;
*/
```