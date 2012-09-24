/*jslint node: true */
"use strict";

var runtime = require("./runtime"),
    context = require("./context"),
    parser = require("../output/grammar").parser,
    interpreter = exports;

interpreter.evaluator = (function () {

    var nodes = {

        IF: function (node, context) {
            if (interpreter.evaluator.evaluate(node.condition, context) === true) {
                node.body.forEach(function (node) {
                    interpreter.evaluator.evaluate(node, context);
                });
            }
        },

        SET_LOCAL_VALUE: function (node, context) {
            context.locals[node.identifier] = interpreter.evaluator.
                evaluate(node.value, context);
        },

        GET_LOCAL_VALUE: function (node, context) {
            return context.locals[node.identifier];
        },

        TEXT: function (node, context) {
            return runtime.newText(node);
        },

        CALL: function (node, context) {
            var evaluatedArgs,
                method;

            // Lookup method

            // If method can't be found look for global scope
            method = runtime.global.methods[node.identifier];

            // Evaluate arguments
            evaluatedArgs = node["arguments"].map(function (argument) {
                return interpreter.evaluator.evaluate(argument, context);
            });

            return method(evaluatedArgs);
        }
    };

    return {

        /**
         * Evaluates a node.
         */
        evaluate: function (node, context) {
            //console.log("Evaluating");
            //console.log("\t" + JSON.stringify(node));
            return nodes[node.type](node, context);
        }

    };

}());

interpreter.evaluate = function (code) {
    var nodes = parser.parse(code),
        result;

    nodes.forEach(function (node) {
        result = interpreter.evaluator.evaluate(node, context);
    });

    return result;
};