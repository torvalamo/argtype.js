# argtype.js

JavaScript function arguments type checker.

## Install and init

### Browser

Use the `argtype.js` file.

#### !! Quirk !!

If at one point in your script you are creating a global
object called 'module', you need to make sure that `argtype.js` is initialized
BEFORE that module object is created, otherwise `argtype.js` will modify it.

    <script src="argtype.js"></script>
    <script src="script-that-makes-a-module-object.js"></script>

### For Node.js

Using [npm](http://npmjs.org)

    npm install argtype

Then in your app

    var argtype = require('argtype')

## Details

Both these forms are accepted, so whatever feels prettier at any given time
can be used ;)

### argtype(thisObj, types, function)
### argtype(thisObj, function, types)

- `thisObj` is what is referenced by 'this' inside the function
- `types` is an array with the format shown below
- `function` is the function that will be wrapped

Returns a function that wraps the original. Use as normal.

### Types array

The types array consists of one entry per 'checked' argument (any arguments
past the length of the types array will not be checked).

Each entry can be one of three different styles:

1. `type`
2. `[optional type]`
3. `[optional type, default value]`

### Valid types

* Any JavaScript type which can be matched with `typeof`, __except
'undefined'__. Examples include 'object', 'number', 'string', 'regexp',
'function', 'boolean', 'array'.
* Types 'integer' or 'float' are interpreted as 'number'
* If the type is an actual RegExp objects (instead of just the string 'regexp'),
the value will be evaluated with the regex. This is useful if you want to make
sure the input is of a specific format.

## Use

Wrap an already defined function

    function formatAddress(number, street, city, zip) {
      return (number ? number + ', ' : '') + street + '\n'
           + city + ' - ' + zip
    }
    
    formatAddress = argtype(this, formatAddress, [['number'], 'string', 'string', /^\d{5}$/])

Or just use a closure

    var formatAddress = argtype(this, [['number'], 'string', 'string', /^\d{5}$/],
                                function(number, street, city, zip) {
      return (number ? number + ', ' : '') + street + '\n'
           + city + ' - ' + zip
    })

Now it will complain if we pass it something bad

    > formatAddress(123, 'JSVille', '12345')
    Error: Function argument 4 got undefined, expected /^\d{5}$/.
    > formatAddress(123, 456, 'JSVille', '12345')
    Error: Function argument 2 got number, expected string.

### Weird errors?

Sometimes the errors can be a little bit misleading, but just check your
input format against your argtypes definition and you'll probably spot it.

In the following snippet the last argument doesn't match the regex of 5 digits.

    > formatAddress('Main Street', 'JSVille', 123)
    Error: Function argument 3 got number, expected /^\d{5}$/.
    > formatAddress('Main Street', 'JSVille', '123')
    Error: Function argument 3 got string, expected /^\d{5}$/.

Below it doesn't find a first argument (number), because it is in
quotes, so it thinks that it belongs to the second argument, seeing as the
first argument is optional. This one can be very tricky to spot, but you're
using a __type checker__ for a reason. Get your types right! ;)

    > formatAddress('123', 'Main Street', 'JSVille', '12345')
    Error: Function argument 3 got string, expected /^\d{5}$/.

## Beware!

You cannot have an optional argument before another argument of the same type.

    > func = argtype(this, function(){}, [['number'], 'number'])
    > func(4)
    Error: Function argument 2 got undefined, expected number.

This will make it think that the optional argument was in fact specified, and
that the non-optional argument is missing!

It could be worked around with a bit of effort, but there will always be corner
cases.

If you have a lot of optional arguments, you should consider putting them in an
options hash object. This has the advantage that same-type optional arguments
are unlimited.

    > func(something, something else, {
      'option1': 'value',
      'option2': 'another'
    })

## License

See the file `COPYING`.
