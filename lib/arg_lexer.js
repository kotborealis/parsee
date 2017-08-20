class Arg{
    constructor(){
        this.start = null;
        this.end = null;
        this.str = '';
    }

    pushChar(c, pos){
        if(this.str === '' && this.start === null){
            this.start = pos;
        }

        if(this.end !== null){
            throw new Error("Arg lexer error: string already ended");
        }

        this.str += c;
    }

    startPos(pos){
        if(this.start !== null || this.str !== ''){
            throw new Error("Arg lexer error: string already started");
        }
        this.start = pos;
    }

    endPos(pos){
        if(this.end !== null){
            throw new Error("Arg lexer error: string already ended");
        }

        this.end = pos;
    }

    toString(){
        return this.str;
    }
}

module.exports = str => {
    const args = [new Arg];

    let inside_string = null;

    let i = 0;
    for(; i < str.length; i++){
        const char = str[i];
        const nextChar = str[i + 1];
        const prevChar = str[i - 1];
        const currentArg = args[args.length - 1];

        if(inside_string === null){
            if(char === ' ' && prevChar === ' '){
                continue;
            }
            if(char === ' '){
                currentArg.endPos(i - 1); // ended on previous char
                args.push(new Arg);
                continue;
            }
        }

        if(char === '"' || char === "'"){
            if(inside_string === null){
                inside_string = char;
                currentArg.startPos(i);
                continue;
            }
            if(inside_string === char){
                currentArg.endPos(i); // ended right here!
                args.push(new Arg);
                inside_string = null;
                continue;
            }
        }

        if(inside_string !== null && char === '\\'){
            if(nextChar === '"' || nextChar === "'"){
                currentArg.pushChar(nextChar, i);
                i++;
                continue;
            }
        }

        currentArg.pushChar(char, i);
    }

    args[args.length - 1].endPos(i - 1);

    return args.filter(arg => arg.str.length);
};

