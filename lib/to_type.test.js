const assert = require('assert');
const to = require('./to_type');
const type = require('./types');

assert(to[type.string]("ass"), "ass");

assert(to[type.number]("1"), 1);
assert(to[type.number]("1.1"), 1.1);
assert(to[type.number]("1,1"), 1.1);
assert.ok(!to[type.number]("ass we can"));

assert.ok(to[type.url]("http://lc.awooo.ru"));
assert.ok(!to[type.url]("ass we can!"));

assert.ok(to[type.bool]('1'));
assert.ok(to[type.bool]('true'));
assert.ok(to[type.bool]('y'));
assert.ok(!to[type.bool]('Yada-yada'));

assert.ok(new Date(to[type.time]('12:00')));
assert.ok(new Date(to[type.date]('12:00')));

const t_enum_lr = type.enum('left', 'right');
assert.ok(to(t_enum_lr)('left'));
assert.ok(to(t_enum_lr)('right'));
assert.ok(!to(t_enum_lr)('AAAAAAAAAAaa'));

const t_regex_defined_lr = type.regex_defined(/.*(лево|право).*/);
assert.ok(to(t_regex_defined_lr)('налево')[1]);
assert.ok(to(t_regex_defined_lr)('направо')[1]);
assert.ok(!to(t_regex_defined_lr)('Арар рар'));

assert(to[type.url]('javascript:alert(1)') === undefined);