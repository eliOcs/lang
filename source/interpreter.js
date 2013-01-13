/*jslint node: true */
"use strict";

var runtime = require("./runtime"),
    interpreter = exports,
    evaluators;

/**
 * Evaluates a node.
 */
function evaluate(node, context) {
    //console.log("Evaluating " + node.type);
    var result = evaluators[node.type](node, context);
    //console.log("Result " + result);
    return result;
}

evaluators = {

    IF: function (node, context) {
        if (evaluate(node.condition, context) === true) {
            node.body.forEach(function (node) {
                evaluate(node, context);
            });
        }
    },

    SET_LOCAL_VALUE: function (node, context) {
        context[node.identifier] = evaluate(node.value, context);
    },

    GET_LOCAL_VALUE: function (node, context) {
        return context[node.identifier];
    },

    TEXT: function (node, context) {
        return runtime.createTextObject(node);
    },

    NUMBER: function (node, context) {
        return runtime.createNumberObject(node);
    },

    FUNCTION: function (node, context) {
        return function () {
            var args = Array.prototype.slice.call(arguments, 0),
                result;

            // Add arguments to context
            args.forEach(function (argument, index) {
                context[node["arguments"][index]] = argument;
            });

            // Evaluate body
            node.body.forEach(function (node) {
                result = evaluate(node, context);
            });

            return result;
        };
    },

    CALL: function (node, context) {
        var evaluatedArgs,
            method;

        // Lookup method
        method = context[node.identifier];

        if (!method) {
            method = runtime.global.methods[node.identifier];
        }

        // Can't find method
        if (!method) {
            throw new Error(node.identifier + " has not been defined.");
        }

        // Evaluate arguments
        evaluatedArgs = node["arguments"].map(function (argument) {
            return evaluate(argument, context);
        });

        return method.apply(null, evaluatedArgs);
    },

    RUNTIME: function (node, context) {
        var evaluatedArgs,
            method;

        method = runtime.global.methods[node.identifier];

        // Evaluate arguments
        evaluatedArgs = node["arguments"].map(function (argument) {
            return evaluate(argument, context);
        });

        return method.apply(null, evaluatedArgs);
    }

};

/**
 * Evaluate a set of nodes.
 */
interpreter.evaluate = function (nodes) {
    var result, context = {};
    nodes.forEach(function (node) {
        result = evaluate(node, context);
    });
    return result;
};