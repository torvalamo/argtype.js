# argtype.js

JavaScript function arguments type checker.

Throws an error on bad types.

## Install

Using [npm](http://npmjs.org)

    npm install argtype

## Use

    var _ = require('argtype').checkArguments

    // weigh(a, b[, difference]) - return largest of two integers, or difference
    function weigh() {
      with(_(arguments,
             ['a', 'b', 'difference'], 
             ['number', 'number', ['boolean']])) { // note extra brackets around optional argument
        if (!!difference) {
          if (weigh(a, b) == a) return a - b
          else return b - a
        }
        return Math.max(a, b)
      }
    }

## Help

Note that it is done this way (using with) because it was originally intended
for browsers only, and not all browsers support tampering with the arguments
object passed through to another function (and nor should they).

If anyone thinks they have a more efficient way to do checking like this (or
just a really effective node-specific way) even if it means a completely
different interface, send me a message on github http://github.com/torvalamo
or an email to tor.valamo@gmail.com, or better yet, fork the project, fix
stuff and request that I pull from you. :)

## License - MIT

Copyright 2010 Tor Valamo. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
