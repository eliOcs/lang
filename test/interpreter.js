/*jslint node: true */
"use strict";

var vows = require("vows"),
    assert = require("assert"),
    lexer = require("../source/lexer"),
    parser = require("../source/parser"),
    interpreter = require("../source/interpreter"),
    runtime = require("../source/runtime"),
    fs = require("fs"),
    path = require("path");

// Mock up print
var prints = [],
    print = runtime.global.methods.print;
runtime.global.methods.print = function (a) {
    prints.push(a);
    return print(a);
};

function evaluate(file) {

    var code = fs.readFileSync(path.resolve("./test/code", file), "utf8");

    return function () {
        interpreter.evaluate(parser.parse(lexer.tokenize(code)));
        return prints
    };
}

vows.describe("Interpreter").addBatch({
    "Hello world": {
        topic: evaluate("hello-world.code"),

        "'print' is called once": function (prints) {
            assert.equal(prints.length, 1);
        },

        "'print' is called with 'Hello world'": function (prints) {
            assert.equal(prints[0], "hello world");
        }
    }
}).exportTo(module);