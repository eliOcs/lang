/*jslint node: true */
"use strict";

var fs = require("fs"),
    files = fs.readdirSync("test"),
    assert = require("assert"),
    codeFilePattern = /([A-Za-z\-]+)\.code/,
    parser = require("../source/parser");

files.
    // Filter code files
    filter(function (file) { return file.match(codeFilePattern); }).
    // Parse and test with result each code file
    map(function (file) {
        var name = file.match(codeFilePattern)[1],
            code = fs.readFileSync("./test/" + file, "utf8"),
            tree = parser.parse(code);

        console.log("Parsing '" + name + "'");
        console.log(JSON.stringify(tree));
        assert.deepEqual(tree, require("./" + name + ".json"));
        console.log("\tOK!");
    });