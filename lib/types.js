module.exports = {
    string: Symbol("string"),
    number: Symbol("number"),
    url: Symbol("url"),
    bool: Symbol("bool"),
    time: Symbol("time"),
    date: Symbol("date"),

    _symbol_enum: Symbol('enum'),
    ['enum']: (...args) => {
        return {
            type: module.exports._symbol_enum,
            list: args.slice(0)
        }
    },

    _symbol_regex_defined: Symbol('regex_defined'),
    regex_defined: (regex) => {
        return {
            type: module.exports._symbol_regex_defined,
            regex: (regex instanceof RegExp) ? regex : new RegExp(regex, 'i')
        }
    },

    rest: Symbol('rest')
};
