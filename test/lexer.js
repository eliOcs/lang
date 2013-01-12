/*jslint node: true */
"use strict";

var vows = require("vows"),
    assert = require("assert"),
    lexer = require("../source/lexer"),
    fs = require("fs"),
    path = require("path"),
    tests = {};

function lex(name) {

    var code = path.resolve("./test/code", name + ".code"),
        expected = path.resolve("./test/lexer", name + ".json");

    return {

        topic: function () {
            var callback = this.callback;
            fs.readFile(code, "utf8",
                function (err, code) {
                    callback(err, lexer.tokenize(code));
                });
        },

        "Generates correct tokens": function (err, tokens) {
            assert.ifError(err);
            assert.deepEqual(tokens, require(expected));
        }

    };
}

// Generate test for each code file
fs.readdirSync("./test/code").forEach(function (file) {
    var name = path.basename(file, ".code");
    tests[name] = lex(name);
});

vows.describe("Lexer").addBatch(tests).exportTo(module);


