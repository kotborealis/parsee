const type = require('./types');
const { URL } = require('url');

const moment = require('moment');
moment.locale('ru');

const to = {
    [type.string]: id => id,
    [type.number]: str => {
        const n = Number.parseFloat(str.replace(',', '.'));
        return isNaN(n) ? undefined : n;
    },
    [type.url]: str => {
        try{
            return (new URL(str)).href;
        }
        catch(e){
            return undefined;
        }
    },
    [type.bool]: str => {
        str = str.toLowerCase();
        return str === '1' || str === 'true' || str === 'y';
    },
    [type.time]: str => moment(str, [
        "HH:mm:ss",
        "HH:mm",
        "HH:mm:ss",
        "HH:mm"
    ], true).unix() || undefined,
    [type.date]: str => moment(str, [
        "DD.MM.YY",
        "DD.MM"
    ], true).unix() || undefined,
    [type._symbol_enum]: (_enum, str) => {
        return _enum.list.includes(str) ? str : undefined;
    },
    [type._symbol_regex_defined]: (_regex_defined, str) => {
        return _regex_defined.regex.exec(str);
    }
};

const target = (_type) => {
    if(to[_type]){
        return to[_type];
    }
    else if(to[_type.type]){
        return to[_type.type].bind(null, _type);
    }
};

const handler = {
    get: (_, prop) => to[prop]
};

module.exports = new Proxy(target, handler);
