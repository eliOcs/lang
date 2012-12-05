/*jslint node: true */
"use strict";

var vows = require("vows"),
    assert = require("assert");

function lex(file) {
    var lexer = require("../source/lexer"),
        fs = require("fs"),
        path = require("path");

    return function () {
        var callback = this.callback;
        fs.readFile(path.resolve("./test/code", file), "utf8",
            function (err, code) {
                callback(err, lexer.tokenize(code));
            });
    };
}

vows.describe("Lexer").addBatch({

    "Hello world": {
        topic: lex("hello-world.code"),

        "generates correct tokens": function (err, tokens) {
            assert.ifError(err);
            assert.deepEqual(tokens, [["IDENTIFIER", "print", 1],
                ["(", "(", 1], ["TEXT", "hello world", 1], [")", ")", 1],
                ["EOF", "", 1]]);
        }
    }

}).exportTo(module);


