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
        ["EOF", "", 1]])

}).exportTo(module);


