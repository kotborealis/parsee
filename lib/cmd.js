module.exports = {};
module.exports._type_cmd = Symbol('create');
module.exports.create_cmd = (cmd, required_args, {strict = false} = {}) => {
    const self = {
        cmd,
        required_args,
        strict,
        type: module.exports._type_cmd,
    };
    self.parse = (str) => module.exports.parse(str, self);
    return self;
};

const lexer = require('./arg_lexer');
const to = require('./to_type');

module.exports.parse = (str, {cmd, required_args, strict}) => {
    //check if str starts with cmd name
    const m = str.match(new RegExp(cmd, 'i')); // Works with strings and regexps
    if(m === null || m.index !== 0){
        return false;
    }

    // slice out cmd name and parse args
    const parsed_args = lexer(str.slice(m[0].length));

    const out_args = [];

    const optional_length = required_args.filter(Array.isArray.bind(null)).length;

    if(parsed_args.length < required_args.length - optional_length){
        return false;
    }

    for(let type of required_args){
        type = type[0] || type;
        if(!out_args[type]){
            out_args[type] = [];
        }
    }

    let last_arg_end = 0;

    if(strict){
        for(let i = 0; i < required_args.length; i++){
            const arg = parsed_args[i].toString();
            const optional = Array.isArray(required_args[i]);
            const type = required_args[i][0] || required_args[i];
            const _ = to(type)(arg);

            if(_ !== undefined && _ !== null){
                out_args.push(_);
                out_args[type].push(_);
                last_arg_end = parsed_args[i].end;
            }
            else if(!optional){
                return false;
            }
        }
    }
    else{
        const parsed_args_set = new Set(parsed_args);

        for(let type of required_args){
            type = type[0] || type;
            for(let arg of parsed_args_set){
                const _ = to(type)(arg.toString());
                if(_ !== undefined && _ !== null){
                    out_args.push(_);
                    out_args[type].push(_);
                    last_arg_end = arg.end;

                    parsed_args_set.delete(arg);
                    break;
                }
            }
        }

        if(out_args.length < required_args.length - optional_length){
            return false;
        }
    }

    out_args.raw_args_str = str.slice(m[0].length);
    out_args.arbitrary_arg = out_args.raw_args_str.slice(last_arg_end + 1).trim();

    return out_args;
};
