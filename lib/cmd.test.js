const {create_cmd, parse: _parse} = require('./cmd');
const type = require('./types');
const assert = require('assert');

const parse = (...args) => {
    const _ = _parse(...args);
    return _;
};

assert.deepEqual(parse('пидорни 3 4 http://imgur.com/ass.png', create_cmd('пидорни', [type.number, type.number, type.url])), [3, 4, 'http://imgur.com/ass.png']);
assert.deepEqual(parse('пидорни http://imgur.com/ass.png 3 4 ', create_cmd('пидорни', [type.number, type.number, type.url])), [3, 4, 'http://imgur.com/ass.png']);
assert.deepEqual(parse('пидорни 3 4 ', create_cmd('пидорни', [type.number, type.number, type.url])), false);
assert.deepEqual(parse('пидорни 3 4 ', create_cmd('пидорни', [type.number, type.number])), [3, 4]);

assert.deepEqual(parse('отрази 1 http://awooo.ru/', create_cmd('отрази', [type.number, type.url], {strict: true})), [1, 'http://awooo.ru/']);
assert.deepEqual(parse('отрази 1 http://awooo.ru/', create_cmd('отрази', [type.number])), [1]);
assert.deepEqual(parse('отрази http://awooo.ru/ 1', create_cmd('отрази', [type.number, type.url], {strict: true})), false);
assert.deepEqual(parse('отрази http://awooo.ru/ 1', create_cmd('отрази', [type.number, type.url], {strict: true})), false);

assert.deepEqual(parse('отрази 1 http://awooo.ru', create_cmd('отрази', [type.number, [type.url]])), [1, 'http://awooo.ru/']);
assert.deepEqual(parse('отрази 1 ', create_cmd('отрази', [type.number, [type.url]])), [1]);

{
    const _ = parse('отрази 1 http://awooo.ru', create_cmd('отрази', [type.number, [type.url]]));
    assert.equal(_[type.number].length, 1);
    assert.equal(_[type.url].length, 1);
}

{
    const _ = _parse('/kick Arar rar', create_cmd('/kick', [type.rest]));
    assert.deepEqual(_, ['Arar rar']);
}

{
    const _ = create_cmd('test', [type.number]);
    assert(_('test 123'));
}