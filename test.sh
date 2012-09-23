#!/bin/bash
echo "Compile grammar"
jison "source/grammar.jison" -o "output/grammar.js"
echo

echo "Test grammar"
node "test/grammar-test.js"
echo

echo "Test interpreter"
node "test/interpreter-test.js"
echo

