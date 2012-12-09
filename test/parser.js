/*jslint node: true */
"use strict";

var vows = require("vows"),
    assert = require("assert");

function parse(file, expected) {
    var lexer = require("../source/lexer"),
        parser = require("../source/parser"),
        fs = require("fs"),
        path = require("path");

    return {

        topic: function () {
            var callback = this.callback;
            fs.readFile(path.resolve("./test/code", file), "utf8",
                function (err, code) {
                    callback(err, parser.parse(lexer.tokenize(code)));
                });
        },

        "Generates correct ast": function (err, nodes) {
            assert.ifError(err);
            assert.deepEqual(nodes, expected);
        }

    };
}

vows.describe("Parser").addBatch({

    "Hello world": parse("hello-world.code", [{"type": "CALL",
        "identifier": "print", "arguments": [{"type": "TEXT",
        "value": "hello world"}]}])

}).exportTo(module);

