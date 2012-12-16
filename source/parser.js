/*jslint node: true */
"use strict";

var grammar = {

    "operators": [
        ["left", "."],
        ["right", "NOT"],
        ["left", "*", "/"],
        ["left", "+", "-"],
        ["left", "IS"],
        ["right", "="],
        ["left", ","]
    ],

    "startSymbol": "Root",

    "bnf": {

        "Root": [
            ["EOF", "return [];"],
            ["Expressions EOF", "return $1;"]
        ],

        "Expressions": [
            ["Expression", "$$ = [$1];"],
            ["Expressions EOL Expression", "$$ = $1.concat($3);"],
            ["Expressions EOL", "$$ = $1;"]
        ],

        "Expression": [
            ["Literal", ""],
            ["Operator", ""],
            ["Assign", ""],
            ["Variable", ""],
            ["Call", ""],
            ["Function", ""],
            ["If", ""]
        ],

        "Literal": [
            ["NUMBER", "$$ = { type: \"NUMBER\", value: Number($1) };"],
            ["TEXT", "$$ = { type: \"TEXT\", value: $1 };"],
            ["TRUE", "$$ = { type: \"TRUE\", value: $1 };"],
            ["FALSE", "$$ = { type: \"FALSE\", value: $1 };"]
        ],

        "Variable": [
            ["IDENTIFIER",
                "$$ = { type: \"GET_LOCAL_VALUE\", identifier: $1 };"]
        ],

        "Call": [
            ["IDENTIFIER ( Arguments )",
                "$$ = { type: \"CALL\",  identifier: $1, arguments: $3 };"]
        ],

        "Arguments": [
            ["", "$$ = [];"],
            ["Expression", "$$ = [$1];"],
            ["Arguments , Expression", "$$ = $1.concat($3);"]
        ],

        "Operator": [
            ["Expression IS Expression", "$$ = {type: \"CALL\", " +
                "identifier: $2, arguments: [$1, $3] };"],
            ["Expression * Expression", "$$ = {type: \"CALL\", " +
                "identifier: \"multiply\", arguments: [$1, $3] };"],
            ["Expression / Expression", "$$ = {type: \"CALL\", " +
                "identifier: \"divide\", arguments: [$1, $3] };"],
            ["Expression + Expression", "$$ = {type: \"CALL\", " +
                "identifier: \"add\", arguments: [$1, $3] };"],
            ["Expression - Expression", "$$ = {type: \"CALL\", " +
                "identifier: \"subtract\", arguments: [$1, $3] };"]
        ],

        "Assign": [
            ["IDENTIFIER = Expression", "$$ = { type: \"SET_LOCAL_VALUE\", " +
                "identifier: $1, value: $3 };"]
        ],

        "If": [
            ["IF ( Expression ) Block",
                "$$ = { type: \"IF\", condition: $3, body: $5 };"]
        ],

        "Function": [
            ["( ArgumentsDefinition ) Block",
                "$$ = { type: \"FUNCTION\", arguments: $2, body: $4 };"]
        ],

        "Block": [
            ["{ Expressions }",
                "$$ = $2;"],
            ["{ EOL Expressions }",
                "$$ = $3;"]
        ],

        "ArgumentsDefinition": [
            ["", "$$ = [];"],
            ["IDENTIFIER", "$$ = [$1];"],
            ["ArgumentsDefinition , IDENTIFIER", "$$ = $1.concat($3);"]
        ]
    }
};

var jison = require("jison"),
    parser = new jison.Parser(grammar);

parser.lexer = {
    lex: function () {
        var token = this.tokens[this.pos];
        this.yytext = token[1];
        this.yylineno = token[2] - 1;   // Convert to zero base count
        this.pos += 1;
        return token[0];
    },
    setInput: function (tokens) {
        this.tokens = tokens;
        this.pos = 0;
    },
    upcomingInput: function () {
        return "";
    }
};

module.exports = parser;