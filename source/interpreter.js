/*jslint node: true */
"use strict";

var runtime = require("./runtime"),
    context = require("./context"),
    interpreter = exports,
    nodeEvalutators;

/**
 * Evaluates a node.
 */
function evaluate(node) {
    return nodeEvalutators[node.type](node, context);
}

nodeEvalutators = {

    IF: function (node, context) {
        if (interpreter.evaluator.evaluate(node.condition, context) === true) {
            node.body.forEach(function (node) {
                evaluate(node, context);
            });
        }
    },

    SET_LOCAL_VALUE: function (node, context) {
        context.locals[node.identifier] = evaluate(node.value, context);
    },

    GET_LOCAL_VALUE: function (node, context) {
        return context.locals[node.identifier];
    },

    TEXT: function (node, context) {
        return runtime.createTextObject(node);
    },

    CALL: function (node, context) {
        var evaluatedArgs,
            method;

        // Lookup method

        // If method can't be found look for global scope
        method = runtime.global.methods[node.identifier];

        // Evaluate arguments
        evaluatedArgs = node["arguments"].map(function (argument) {
            return evaluate(argument, context);
        });

        return method(evaluatedArgs);
    }

};

/**
 * Evaluate a set of nodes.
 */
interpreter.evaluate = function (nodes) {
    var result;
    nodes.forEach(function (node) {
        result = evaluate(node);
    });
    return result;
};