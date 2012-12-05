/*jslint node: true */
"use strict";

var vows = require("vows"),
    assert = require("assert");

function lex(file, expected) {
    var lexer = require("../source/lexer"),
        fs = require("fs"),
        path = require("path");

    return {

        topic: function () {
            var callback = this.callback;
            fs.readFile(path.resolve("./test/code", file), "utf8",
                function (err, code) {
                    callback(err, lexer.tokenize(code));
                });
        },

        "Generates correct tokens": function (err, tokens) {
            assert.ifError(err);
            assert.deepEqual(tokens, expected);
        }

    };
}

vows.describe("Lexer").addBatch({

    "Hello world": lex("hello-world.code", [["IDENTIFIER", "print", 1],
        ["(", "(", 1], ["TEXT", "hello world", 1], [")", ")", 1],
        ["EOF", "", 1]]),

    "If": lex("if.code", [["IDENTIFIER", "variable", 1], ["=", "=", 1],
        ["TEXT", "lemon", 1], ["EOL", "", 1], ["EOL", "", 2], ["IF", "if", 3],
        ["(", "(", 3], ["IDENTIFIER", "variable", 3], ["IS", "is", 3],
        ["TEXT", "lemon", 3], [")", ")", 3], ["{", "{", 3], ["EOL", "", 3],
        ["IDENTIFIER", "print", 4], ["(", "(", 4], ["TEXT", "true!", 4],
        [")", ")", 4], ["EOL", "", 4], ["}", "}", 5], ["EOF", "", 5]])

}).exportTo(module);


