/*jslint node: true */
"use strict";

var runtime = exports;

runtime.createTextObject = function (node) {
    return node.value;
};

runtime.createNumberObject = function (node) {
    return Number(node.value);
};

runtime.global = {};
runtime.global.methods = {

    print: function (a) {
        return console.log(a);
    },

    is: function (a, b) {
        return a === b;
    },

    add: function (a, b) {
        return a + b;
    },

    subtract: function (a, b) {
        return a - b;
    },

    multiply: function (a, b) {
        return a * b;
    },

    divide: function (a, b) {
        return a / b;
    }

};

