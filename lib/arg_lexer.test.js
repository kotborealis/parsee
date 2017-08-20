const _lexer = require('./arg_lexer');
const lexer = str => _lexer(str).map(i => i.toString());
const assert = require('assert');

assert.deepEqual(lexer('             ass'), ['ass']);
assert.deepEqual(lexer('ass we can'), ['ass', 'we', 'can']);
assert.deepEqual(lexer('ass we              can'), ['ass', 'we', 'can']);
assert.deepEqual(lexer('ass we "can"'), ['ass', 'we', 'can']);
assert.deepEqual(lexer('ass "we    can"'), ['ass', 'we    can']);
assert.deepEqual(lexer('ass \'we    can\''), ['ass', 'we    can']);
assert.deepEqual(lexer(`ass "we \\" can"`), ['ass', `we " can`]);
assert.deepEqual(lexer(`ass 'we \\' can'`), ['ass', `we ' can`]);
assert.deepEqual(lexer(`ass 'we \\t can'`), ['ass', `we \\t can`]);
assert.deepEqual(lexer(`ass 'we " can'`), ['ass', `we " can`]);
assert.deepEqual(lexer(`ass "we ' can"`), ['ass', `we ' can`]);
assert.deepEqual(lexer(`ass "we can" so hard`), ['ass', `we can`, 'so', 'hard']);

assert.deepEqual(_lexer('ass we can'), [{ start: 0, end: 2, str: 'ass' },
    { start: 4, end: 5, str: 'we' },
    { start: 7, end: 9, str: 'can' } ]);
assert.deepEqual(_lexer('"can"'), [{ start: 0, end: 4, str: 'can' }]);
