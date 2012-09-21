/* Lexical grammar */
%lex

%%
\s+                             // Ignore whitespace
"("                             return "(";
")"                             return ")";
"{"                             return "{";
"}"                             return "}";
"="                             return "=";

"is"                            return "IS";
"not"                           return "NOT";
"if"                            return "IF";

[0-9]+                          return "NUMBER";
\"[^\"]*\"                      return "TEXT";
[A-Za-z\-]+                     return "IDENTIFIER";
"true"                          return "TRUE";
"false"                         return "FALSE";

/lex

/* Operators */
%left "."
%left "NOT"
%left "IS"
%left ","

%start Root

/* Language grammar */
%%

Root
    : /* Empty */
        %{
            console.log("No code");
            return [];
        }%
    | Expressions
        %{
            console.dir(JSON.stringify($1));
            return $1;
        }%
    ;

Expressions
    : Expression
        { $$ = [$1]; }
    | Expressions Expression
        { $$ = $1.concat($3); }
    ;

Expression
    : Literal
    | Call
    | Operator
    | Assign
    | If
    | "(" Expression ")"
    ;

Literal
    : NUMBER
        { $$ = { type: "NUMBER", value: Number(yytext) }; }
    | TEXT
        { $$ = { type: "TEXT", value: yytext.slice(1, -1) }; }
    | TRUE
        { $$ = { type: "TRUE", value: true }; }
    | FALSE
        { $$ = { type: "FALSE", value: false }; }
    ;

Call
    : IDENTIFIER "(" Arguments ")"
        { $$ = { type: "CALL",  value: $1, arguments: $3 }; }
    ;

Arguments
    :
        /* No arguments */
    | Expression
        { $$ = [$1]; }
    | Arguments "," Expression
        { $$ = $1.concat($2); }
    ;

Operator
    : Expression

Assign
    : IDENTIFIER "=" Expression
        { $$ = { type: "SET_LOCAL_VALUE", identifier: $1, value: $3 }; }
    ;

If
    : IF Expression "{" Expressions "}"
    ;