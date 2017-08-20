const {create_cmd} = require('./lib/cmd');

const props = {
    cmd: create_cmd,
    type: require('./lib/types')
};

module.exports = new Proxy(create_cmd, {
    get: (target, prop) => props[prop]
});