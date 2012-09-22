/*jslint node: true */
"use strict";

var runtime = require("./runtime"),
    parser = require("../output/grammar").parser,
    interpreter = exports;

var evaluator = {
    TEXT: function (node, context) {
        return runtime.newText(node);
    },

    CALL: function (node, context) {
        var evaluatedArguments;
        // Lookup method

        // Evaluate arguments
        evaluatedArguments = node["arguments"].map(function (argument) {
            return evaluator[argument.type](argument, context);
        });

        console.log(evaluatedArguments[0]);

    }
};

interpreter.evaluate = function (code) {
    var nodes = parser.parse(code);

    nodes.forEach(function (node) {
        var result = evaluator[node.type](node, {});
        console.log("-> " + result);
    });
};

interpreter.main = function (args) {
    var fs = require("fs"),
        code = fs.readFileSync(args[2], "utf8");

    interpreter.evaluate(code);
};

interpreter.main(process.argv);