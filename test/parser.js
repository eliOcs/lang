/*jslint node: true */
"use strict";

var vows = require("vows"),
    assert = require("assert"),
    fs = require("fs"),
    path = require("path"),
    lexer = require("../source/lexer"),
    parser = require("../source/parser"),
    tests = {};

/**
 * Parse the code and compare the resulting AST with the expected one.
 */
function parse(name) {

    var code = path.resolve("./test/code", name + ".code"),
        expected = path.resolve("./test/parser", name + ".json");

    return {

        topic: function () {
            var callback = this.callback;
            fs.readFile(code, "utf8",
                function (err, code) {
                    callback(err, parser.parse(lexer.tokenize(code)));
                });
        },

        "Generates correct ast": function (err, nodes) {
            assert.ifError(err);
            assert.deepEqual(nodes, require(expected));
        }

    };

}

// Generate test for each code file
fs.readdirSync("./test/code").forEach(function (file) {
    var name = path.basename(file, ".code");
    tests[name] = parse(name);
});

vows.describe("Parser").addBatch(tests).exportTo(module);


