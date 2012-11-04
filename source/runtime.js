/*jslint node: true */
"use strict";

var runtime = exports;

runtime.createTextObject = function (node) {
    return node.value;
};

runtime.global = {};
runtime.global.methods = {
    print: function (args) {
        return console.log(args[0]);
    },

    is: function (args) {
        return args[0] === args[1];
    },

    add: function (args) {
        return args[0] + args[1];
    },

    subtract: function (args) {
        return args[0] - args[1];
    },

    multiply: function (args) {
        return args[0] * args[1];
    },

    divide: function (args) {
        return args[0] / args[1];
    }
};

