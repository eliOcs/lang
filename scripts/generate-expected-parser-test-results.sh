#!/bin/bash

# Use the parser to generate the expected parser result for each test code file.
for code in test/code/*.code
do
    result=test/parser/${code##*/}
    result=${result%.*}.json

    binaries/parser $code > $result
done