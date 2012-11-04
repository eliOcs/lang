/* Lexical grammar */
%lex
%%

\s+                             { /* ignore whitespace */ }
";"                             { return "TERMINATOR"; }
"("                             { return "("; }
")"                             { return ")"; }
"}"                             return "}";
"{"                             return "{";
"="                             { return "="; }
","                             { return ","; }
"is"                            { return "IS"; }
"not"                           { return "NOT"; }
"if"                            { return "IF"; }
"*"                             { return "*"; }
"/"                             { return "/"; }
"+"                             { return "+"; }
"-"                             { return "-"; }
[0-9]+                          { return "NUMBER"; }
\"[^\"]*\"                      { return "TEXT"; }
[A-Za-z\-]+                     { return "IDENTIFIER"; }
"true"                          { return "TRUE"; }
"false"                         { return "FALSE"; }
<<EOF>>                         { return "EOF"; }

/lex

/* Operators */
%left       "."
%right      "NOT"
%left       "*" "/"
%left       "+" "-"
%left       "IS"
%right      "="
%left       ","

%start Root

/* Language grammar */
%%

Root
    : /* Empty */
        { return []; }
    | Expressions EOF
        { return $1; }
    ;

Expressions
    : Expression
        { $$ = [$1]; }
    | Expressions TERMINATOR Expression
        { $$ = $1.concat($2); }
    ;

Expression
    : Literal
    | Operator
    | Assign
    | Variable
    | Call
    | Function
    | If
    ;

Literal
    : NUMBER
        { $$ = { type: "NUMBER", value: Number($1) }; }
    | TEXT
        { $$ = { type: "TEXT", value: $1.slice(1, -1) }; }
    | TRUE
        { $$ = { type: "TRUE", value: true }; }
    | FALSE
        { $$ = { type: "FALSE", value: false }; }
    ;

Variable
    : IDENTIFIER
        { $$ = { type: "GET_LOCAL_VALUE", identifier: $1 }; }
    ;

Call
    : IDENTIFIER "(" Arguments ")"
        { $$ = { type: "CALL",  identifier: $1, arguments: $3 }; }
    ;

Arguments
    :
        /* No arguments */
        { $$ = []; }
    | Expression
        { $$ = [$1]; }
    | Arguments "," Expression
        { $$ = $1.concat($3); }
    ;


Operator
    : Expression IS Expression
        { $$ = {type: "CALL", identifier: $2, arguments: [$1, $3] }; }
    | Expression "*" Expression
        { $$ = {type: "CALL", identifier: "multiply", arguments: [$1, $3] }; }
    | Expression "/" Expression
        { $$ = {type: "CALL", identifier: "divide", arguments: [$1, $3] }; }
    | Expression "+" Expression
        { $$ = {type: "CALL", identifier: "add", arguments: [$1, $3] }; }
    | Expression "-" Expression
        { $$ = {type: "CALL", identifier: "subtract", arguments: [$1, $3] }; }
    ;

Assign
    : IDENTIFIER "=" Expression
        { $$ = { type: "SET_LOCAL_VALUE", identifier: $1, value: $3 }; }
    ;

If
    : IF "(" Expression ")" "{" Expressions "}"
        { $$ = { type: "IF", condition: $3, body: $6 }; }
    ;

Function
    : "(" ArgumentsDefinition ")" "{" Expressions "}"
        { $$ = { type: "FUNCTION", arguments: $2, body: $5 }; }
    ;

ArgumentsDefinition
    :
        /* No arguments */
        { $$ = []; }
    | IDENTIFIER
        { $$ = [$1]; }
    | ArgumentsDefinition "," IDENTIFIER
        { $$ = $1.concat($3); }
    ;
