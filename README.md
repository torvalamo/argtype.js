# argtype.js

Completely rewritten. Old docs no longer relevant, more will come here.

Example of use:

    var func = argtype(this, ['?b', true, 'n=[-9,9]', 'f'],
               function(aBool, aNum, aFunc) {
                 /* stuff here */
               })

* The first (optional) argument is a boolean with default value true.
* The second (required) argument must be a number (int or float) between -9 and +9 (inclusive).
* The third (required) argument is a function.

Putting it short:

* `?` means optional, and must be the first character of the argtype string. `'?s'` - optional string.
* `0` means its value can be null. This must be the next character (first if no optional). `'0s'` - required string, but can be null
* `+` means that the value must be either an unsigned (positive) number, or case-sensitivity in a regex part (see below).
* Then follows the type character. There are many different types:
** `.` - Untyped (the type of the input is not checked, just optionality and default values)
** `n` - Number. Use `i` for integer and `f` for float to be specific.
** `s` - String.
** `b` - Boolean.
** `c` - Function. The input must match typeof 'function'
** `o` - Object. An object that matches typeof 'object'. Function-objects will not match (see `t`)
** `a` - Array. Input matches instanceof Array.
** `t` - Function-object. Input matches instanceof the function-object given in the next argument.
* After the type character comes range limits and/or pattern matching. Only some types support either.
** `/` indicates a regular expression follows until the end of the string. This will be matched against untyped or string inputs. It will be ignored for any other types.
** `=` indicates that the value is within a range, given as a closed interval `[from,to]` or an open interval `(from,to)`. Bracket types can be mixed, like so `[closed,open)`.
** `>`, `>=`, `<`, `<=` indicates that the value should be 'greater than', 'greater than or equal to', 'lesser than' or 'lesser than or equal to' the number which follows. `s>3` - A string longer than 3 characters. Length also works for arrays. Numbers use their actual value.

The next argument can be (in the case of 't') further specification of the string definition, and must be the function-object which input will be matched (instanceof) against.

It can also be the default value for an optional argument, or in the case of 'o' (object) it can contain default attribute values.
A 't' type can also have an optional argument, but then as the second argument after the definition (following the function-object).

## License

See the file `LICENSE`.
