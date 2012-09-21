/* Lexical grammar */
%lex

%%
\s+                             // Ignore whitespace
<<EOF>>                         return "END";
"("                             return "(";
")"                             return ")";
"{"                             return "{";
"}"                             return "}";
"="                             return "=";

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
    | declarations
    ;

declarations
    : identifier "(" ")" "{" statements "}"
        { console.log("[FUNCTION DECLARATION]"); }
    | identifier "=" literal
        { console.log("[VARIABLE DECLARATION]"); }
    ;

identifier
    : IDENTIFIER
        { console.log("[INDENTIFIER, " + yytext + "]"); }
    ;

literal
    : NUMBER
        { console.log("[NUMBER, " + Number(yytext) + "]"); }
    | TEXT
        { console.log("[TEXT, " + yytext.slice(1,-1) + "]"); }
    ;