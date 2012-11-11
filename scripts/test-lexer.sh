#!/bin/bash
for file in test/*.code
do
    if diff <(./binaries/lexer "$file" | tee /dev/null) "./test/lexer/$(basename "${file%.*}")"
    then
        echo "Test succesful for $file"
    else
        echo "Test failed for $file"
    fi
done