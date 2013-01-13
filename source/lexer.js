/*jslint node: true */
"use strict";

/*jslint regexp: true */
var lexer = exports,
    regex = {
        identifier: /^[A-Za-z\-]+/,
        text: /^\"(.*)\"/,  // TODO: Improve string regex
                            //  1. Allow a way of escaping '"'
                            //  2. Don't use . in regex
        number: /^(\-?\d)+/   // TODO: Improve to allow decimals
    };
/*jslint regex: false */

function identifiers(context, code) {

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
        context.tokens.push([name, value, context.line]);

        return value.length;
    } else {
        return 0;
    }

}

function texts(context, code) {

    var match = regex.text.exec(code),
        value;

    if (match) {
        value = match[1];
        context.tokens.push(["TEXT", value, context.line]);
        return match[0].length;
    } else {
        return 0;
    }

}

function numbers(context, code) {

    var match = regex.number.exec(code),
        value;

    if (match) {
        value = match[1];
        context.tokens.push(["NUMBER", value, context.line]);
        return match[0].length;
    } else {
        return 0;
    }

}

function symbols(context, code) {
    var symbol = code.slice(0, 1);

    switch (symbol) {

    // Accepted symbols
    case "(":
    case ")":
    case "{":
    case "}":
    case ",":
    case "=":
    // Mathematical operators
    case "+":
    case "-":
    case "*":
    case "/":
        context.tokens.push([symbol, symbol, context.line]);
        break;

    case "\n":
        context.tokens.push(["EOL", "", context.line]);
        context.line += 1;
        break;

    // Ignored symbols
    default:
        break;
    }

    return 1;

}

/**
 * Returns the string representation for the token list.
 */
function stringify(tokens) {

    var result = "[\n";
    tokens.forEach(function (token) {
        result += "    " + JSON.stringify(token) + "\n";
    });
    result += "]";

    return result;

}

lexer.tokenize = function (code, options) {

    var context = {
            tokens: [],
            line: 1
        },
        current = 0,
        advance,
        chunk;

    for (chunk = code; chunk.length > 0; chunk = code.slice(current)) {
        advance = identifiers(context, chunk) || texts(context, chunk) ||
            numbers(context, chunk) || symbols(context, chunk);
        current += advance;
    }

    context.tokens.push(["EOF", "", context.line]);

    options = options || {};
    if (options.verbose) {
        console.log(stringify(context.tokens));
    }

    return context.tokens;

};

