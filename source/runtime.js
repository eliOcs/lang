/*jslint node: true */
"use strict";

var runtime = exports;

runtime.newText = function (node) {
    return node.value;
};

runtime.global = {};
runtime.global.methods = {
    print: function (args) {
        return console.log(args[0]);
    },

    is: function (args) {
        return args[0] === args[1];
    }

};

