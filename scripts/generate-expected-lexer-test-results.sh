#!/bin/bash

# Use the lexer to generate the expected lexer result for each test code file.
for code in test/code/*.code
do
    result=test/lexer/${code##*/}
    result=${result%.*}.json

    binaries/lexer $code > $result
done