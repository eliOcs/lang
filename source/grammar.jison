/* Lexical grammar */
%lex

%%
\s+                             // Ignore whitespace
<<EOF>>                         return "END";

[0-9]+                          return "NUMBER";
\"[^\"]*\"                      return "TEXT";

[A-Za-z\-]+                     return "IDENTIFIER";

/lex

/* Operators */

%start code

/* Language grammar */
%%

code
    : statements END
    ;

statements
    : statement statements
    | statement
    ;

statement
    : literal
    | IDENTIFIER
        { console.log("[INDENTIFIER, " + yytext + "]"); }
    ;

literal
    : NUMBER
        { console.log("[NUMBER, " + Number(yytext) + "]"); }
    | TEXT
        { console.log("[TEXT, " + yytext.slice(1,-1) + "]"); }
    ;