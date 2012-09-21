#!/bin/bash
echo "Compile grammar"
jison "source/grammar.jison" -o "output/grammar.js"
echo
echo "Hello world"
echo "Code"
cat "test/hello-world.code"
echo
echo "Nodes"
node "output/grammar.js" "test/hello-world.code"
echo

echo "If"
echo "Code"
cat "test/if.code"
echo
echo "Nodes"
node "output/grammar.js" "test/if.code"
