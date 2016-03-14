# argtype.js

[![npm version](https://badge.fury.io/js/argtype.svg)](https://badge.fury.io/js/argtype)
[![Build Status](https://travis-ci.org/torvalamo/argtype.js.svg?branch=master)](https://travis-ci.org/torvalamo/argtype.js)

    npm install argtype

## 2016

If anyone wants to contribute to cleaning up this stuff, feel free to create pull requests. I have a snaky suspicion there might be a smarter way to implement this concept.

Added package.json, since it broke npm.

Also I have no idea why people use this, but apparently some do, which is the only reason I felt like updating the npm entry.

## Usage

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
  * `.` - Untyped (the type of the input is not checked, just optionality and default values)
  * `n` - Number. Use `i` for integer and `f` for float to be specific.
  * `s` - String.
  * `b` - Boolean.
  * `c` - Function. The input must match typeof 'function'
  * `o` - Object. An object that matches typeof 'object'. Function-objects will not match (see `t`)
  * `a` - Array. Input matches instanceof Array.
  * `t` - Function-object. Input matches instanceof the function-object given in the next argument.
* After the type character comes range limits and/or pattern matching. Only some types support either.
  * `/` indicates a regular expression follows until the end of the string. This will be matched against untyped or string inputs. It will be ignored for any other types.
  * `=` indicates that the value is within a range, given as a closed interval `[from,to]` or an open interval `(from,to)`. Bracket types can be mixed, like so `[closed,open)`.
  * `>`, `>=`, `<`, `<=` indicates that the value should be 'greater than', 'greater than or equal to', 'lesser than' or 'lesser than or equal to' the number which follows. `s>3` - A string longer than 3 characters. Length also works for arrays. Numbers use their actual value.

The next argument can be (in the case of 't') further specification of the string definition, and must be the function-object which input will be matched (instanceof) against.

It can also be the default value for an optional argument, or in the case of 'o' (object) it can contain default attribute values.
A 't' type can also have an optional argument, but then as the second argument after the definition (following the function-object).

## Simplified BSD License

Copyright (c) 2012, Tor Valamo
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
