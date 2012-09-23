/*jslint node: true */
"use strict";

var fs = require("fs"),
    files = fs.readdirSync("test"),
    assert = require("assert"),
    codeFilePattern = /([A-Za-z\-]+)\.code/,
    interpreter = require("../source/interpreter.js");

files.
    // Filter code files
    filter(function (file) { return file.match(codeFilePattern); }).
    // Execute code
    map(function (file) {
        var name = file.match(codeFilePattern)[1],
            code = fs.readFileSync("./test/" + file, "utf8");

        console.log("Executing '" + name + "'");
        interpreter.evaluate(code);
    });