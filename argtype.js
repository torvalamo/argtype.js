/**
 * Tor Valamo <tor.valamo@gmail.com>
 * http://github.com/torvalamo/argtype.js/
 *
 * License: MIT
 * See file COPYING for details.
 */

function argtypeCheck(value, type) {
  if (value == undefined) {
    return false
  } else if (type instanceof RegExp) {
    // type can be a format check regex
    // for instance /^[a-z]+$/ to ensure only lower case a-z
    return type.test(value)
  } else if (type == 'regexp') {
    return value instanceof RegExp
  } else if (type == 'array') {
    return value instanceof Array
  } else {
    if (type == 'integer' || type == 'float') type = 'number'
    return typeof value == type
  }
}

function argtype(thisObj, args, func) {
  if (arguments.length < 3) {
    throw new Error('Argtype: Needs 3 arguments.')
  }
  if (typeof thisObj != 'object') {
    throw new Error('Argtype: First argument must always be' +
                    ' an object, array or null (global).')
  }
  if (args instanceof Function && func instanceof Array) {
    // this is acceptable input (don't want to force one particular order).
    // both the normal closure "convention"
    //  argtype(this, [args], function(...) {...})
    // and the nicer looking (if your func has a name already)
    //  argtype(this, someFunc, [args])
    // are acceptable
    var tmp = args
    args = func
    func = tmp
  }
  if (!(args instanceof Array) || !(func instanceof Function)) {
    throw new Error('Argtype: Must have one function and one array as' +
                    ' arguments (order is irrelevant).')
  }
  return function() {
    var argslist = []
      , i = 0
    for (var a = 0; a < args.length; a++) {
      // if the argument is square bracketed (array), it's optional
      var optional = args[a] instanceof Array
        , type = optional ? args[a][0] : args[a]
      if (!argtypeCheck(arguments[i], type)) {
        // wrong type
        if (!optional) {
          // has wrong type or is missing, so we complain!
          throw new Error('Function argument ' + (i + 1) +
                          ' got ' + (typeof arguments[i]) +
                          ', expected ' + type + '.')
        }
        // set its default value (or undefined, by design)
        argslist.push(args[a][1])
      } else {
        // correct type
        argslist.push(arguments[i++])
      }
    }
    // concatenate any arguments beyond the type check
    argslist = argslist.concat(Array.prototype.slice.call(arguments, i))
    func.apply(thisObj, argslist)
  }
}

// for CommonJS use, we export the function
// browsers will (generally) ignore, just make sure you load this file first
// if you at any point specify a global module object yourself
if (module) {
  module.exports = argtype
}
