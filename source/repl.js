/*jslint node: true */
"use strict";

var readline = require("readline"),
    rl = readline.createInterface(process.stdin, process.stdout),
    interpreter = require("./interpreter"),
    colors = require("cli-color").bgBlack;

rl.setPrompt("> ");
rl.prompt();

rl.on("line", function (line) {
    console.log(colors.blackBright(interpreter.evaluate(line)));
    rl.prompt();
}).on("close", function () {
    console.log(colors.yellow("Bye bye."));
    process.exit(0);
});