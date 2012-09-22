/*jslint node: true */
"use strict";

var fs = require("fs"),
    files = fs.readdirSync("test"),
    assert = require("assert"),
    codeFilePattern = /(.+)\.code/,
    parser = require("../output/grammar.js").parser;

files.
    // Filter code files
    filter(function (file) { return file.match(codeFilePattern); }).
    // Parse and test with result each code file
    map(function (file) {
        var name = file.match(codeFilePattern)[1],
            code = fs.readFileSync("./test/" + file, "utf8");

        console.log("Parsing " + name);
        assert.deepEqual(parser.parse(code), require("./" + name + ".json"));
    });