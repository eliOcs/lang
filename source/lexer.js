/*jslint node: true */
"use strict";

/*jslint regexp: true */
var lexer = exports,
    regex = {
        identifier: /^[A-Za-z\-]+/,
        text: /^\"(.*)\"/   // TODO: Improve string regex
                            //  1. Allow a way of escaping '"'
                            //  2. Don't use . in regex
    };
/*jslint regex: false */

function identifiers(tokens, code) {

    var match = regex.identifier.exec(code),
        name,
        value;

    if (match) {
        value = match[0];

        switch (value) {
        // Keywords
        case "if":
        case "is":
        case "not":
            name = value.toUpperCase();
            break;

        // Identifier
        default:
            name = "IDENTIFIER";
            break;
        }

        // Add token
        tokens.push([name, value]);

        return value.length;
    } else {
        return 0;
    }

}

function texts(tokens, code) {

    var match = regex.text.exec(code),
        value;

    if (match) {
        value = match[1];
        tokens.push(["TEXT", value]);
        return match[0].length;
    } else {
        return 0;
    }

}

function symbols(tokens, code) {
    var symbol = code.slice(0, 1);

    switch (symbol) {

    // Accepted symbols
    case "(":
    case ")":
        tokens.push([symbol, symbol]);
        break;

    case "\n":
        tokens.push(["EOL", ""]);
        break;

    // Ignored symbols
    default:
        break;
    }

    return 1;

}

lexer.tokenize = function (code) {

    var tokens = [],
        current = 0,
        advance,
        chunk;

    for (chunk = code; chunk.length > 0; chunk = code.slice(current)) {
        advance = identifiers(tokens, chunk) ||
            texts(tokens, chunk) ||
            symbols(tokens, chunk);
        current += advance;
    }

    tokens.push(["EOF", ""]);

    return tokens;

};

