/* Lexical grammar */
%lex

%%
\s+             // Ignore whitespace
<<EOF>>         return 'END';

/* Literals */
[0-9]+          return "NUMBER";

/lex

/* Operators */

%start SourceCode

/* Language grammar */
%%

SourceCode
    : expressions END
    ;

expressions
    : expression expressions
    | expression
    ;

expression
    : literal
    ;

literal
    : NUMBER
        { console.log("NUMBER - " + Number(yytext)); }
    ;