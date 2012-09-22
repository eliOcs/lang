/* Lexical grammar */
%lex

%%
\s+                             // Ignore whitespace
"("                             return "(";
")"                             return ")";
"{"                             return "{";
"}"                             return "}";
"="                             return "=";
","                             return ",";

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
%left       "."
%right      "NOT"
%left       "IS"
%right      "="
%left       ","

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
        { $$ = $1.concat($2); }
    ;

Expression
    : Literal
    | Call
    | Variable
    | Operator
    | Assign
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
        { $$ = { type: "CALL",  value: $1, arguments: $3 }; }
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
        { $$ = {type: "EQUALITY", leftOperand: $1, rightOperand: $3 }; }
    ;

Assign
    : IDENTIFIER "=" Expression
        { $$ = { type: "SET_LOCAL_VALUE", identifier: $1, value: $3 }; }
    ;

If
    : IF "(" Expression ")" "{" Expressions "}"
        { $$ = { type: "IF", condition: $3, value: $6 }; }
    ;