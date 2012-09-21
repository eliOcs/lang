#!/bin/bash
echo "Compile grammar"
jison "source/grammar.jison" -o "output/grammar.js"
echo "Test"
node "output/grammar.js" "test/grammar-test"