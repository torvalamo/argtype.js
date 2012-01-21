/**
 * Tor Valamo <tor.valamo@gmail.com>
 * http://github.com/torvalamo/argtype.js/
 *
 * License: MIT
 * See file COPYING for details.
 */

console.debug = console.log

function __typeof(arg) {
  return typeof arg == this.ctype
}

function __length(arg) {
  arg = this.ctype == 'number' ? arg : arg.length
  if (this.low) {
    if (this.low[0] == 'gt' && arg <= this.low[1]) return false
    else if (arg < this.low[1]) return false
  }
  if (this.high) {
    if (this.high[0] == 'lt' && arg >= this.high[1]) return false
    else if (arg > this.high[1]) return false
  }
  return true
}

function __regex(arg) {
  return this.regex.test(arg)
}

function __typeof_length(arg) {
  return __typeof.call(this, arg) && __length.call(this, arg)
}

function __typeof_regex(arg) {
  return __typeof.call(this, arg) && __regex.call(this, arg)
}

function __typeof_length_regex(arg) {
  return __typeof_length.call(this, arg) && __regex.call(this, arg)
}

function __ctype(arg) {
  return arg instanceof this.ctype
}
  
function _checkRecursive(args, list, array, level) {
  level = level || 0
  if (!args.length) {
    // no more args, check if the remaining list is required
    if (!list.length) {
      console.debug(level + ': Args0: List0')
      return true // no more list
    } else if (list[0].required) {
      console.debug(level + ': Args0: Required missing: ' + list[0])
      return false // current is required
    } else {
      console.debug(level + ': Args0: Recursing...')
      array.push(list[0].default)
      return _checkRecursive(args, list.slice(1), array, level + 1) // keep checking
    }
  }
  if (!list.length) {
    console.debug(level + ': List0')
    return true
  }
  // check if current is a match (or allowed null)
  if (list[0].match(args[0]) || (!list[0].notnull && args[0] === null)) {
    console.debug(level + ': Arg matched list, or was allowed null (' + !list[0].notnull + ')')
    // it is, continue recursing
    var arr = array.length
    array.push(args[0])
    console.debug(level + ': Recursing...')
    if (_checkRecursive(args.slice(1), list.slice(1), array, level + 1)) {
      console.debug(level + ': Success!')
      return true
    }
    console.debug(level + ': Recursing failed')
    array.splice(arr) // remove any potential added elements
  }
  // no match, is it required? if not, skip
  if (!list[0].required) {
    console.debug(level + ': Not required, skipping')
    array.push(list[0].default)
    return _checkRecursive(args, list.slice(1), array, level + 1)
  }
  console.debug(level + ': No match, missing required')
  return false
}

function argtype(thisObj, args, func) {
  var a = 0
    , len = args.length
    , argslist = []
    , current = -1
    , ptr
    , re = /^(\?)?(0)?(\+)?([\.nifsbcoat])(?:\=(\(|\[)(\-?(\d+(?:.\d+)?)?)\,(\-?(\d+(?:.\d+)?)?)(\)|\])|((?:\>|\<)\=?)(\-?\d+(?:.\d+)?)|\/(.*))?$/i
    , matches = null
    
  // Parse the arguments list
  for (; a < len ; a++) {
    if (typeof args[a] == 'string' && (matches = args[a].match(re))) {
      // Does the string have proper argtype format?
      if (matches === null) {
        throw new SyntaxError('Argtype argument ' + a +
                              ' is not a valid argtype string')
      }
      
      // Add this new argument
      argslist.push({
        required: !matches[1],
        notnull: !matches[2],
        type: matches[4]
      })
      
      // Advance pointer
      ptr = argslist[++current]
      
      // Regex
      if (matches[11]) {
        ptr.regex = new RegExp(matches[11], matches[3] ? undefined : 'i')
      }
      
      // Range
      var operator = {
          '(': 'gt'
        , '[': 'gte'
        , ')': 'lt'
        , ']': 'lte'
        , '>': 'gt'
        , '>=': 'gte'
        , '<': 'lt'
        , '<=': 'lte'}
      if (matches[5]) {
        if (matches[6]) ptr.low = [operator[matches[5]], parseFloat(matches[6])]
        if (matches[7]) ptr.high = [operator[matches[8]], parseFloat(matches[7])]
      }
      if (matches[9]) {
        if (matches[9] == '>' || matches[9] == '>=') {
          ptr.low = [operator[matches[9]], parseFloat(matches[10])]
        } else {
          ptr.high = [operator[matches[9]], parseFloat(matches[10])]
        }
      }
      
      // Type specifics
      switch (ptr.type) {
        case '.': // No type check
          ptr.match = ptr.regex
                      ? __regex
                      : function(){return true}
          break
        case 'n': // Number (integer or float)
          ptr.ctype = 'number'
          ptr.match = (ptr.low || ptr.high)
                      ? __typeof_length
                      : __typeof 
          break
        case 'i': // Integer
          ptr.ctype = 'number'
          ptr.regex = /^\-?\d+$/
          ptr.match = (ptr.low || ptr.high)
                      ? __typeof_length_regex
                      : __typeof_regex
          break
        case 'f': // Float/double
          ptr.ctype = 'number'
          ptr.regex = /^\-?\d+\.\d+$/
          ptr.match = (ptr.low || ptr.high)
                      ? __typeof_length_regex
                      : __typeof_regex
          break
        case 's': // String
          ptr.ctype = 'string'
          ptr.match = ptr.regex
                      ? (ptr.low || ptr.high)
                        ? __typeof_length_regex
                        : __typeof_regex
                      : (ptr.low || ptr.high)
                        ? __typeof_length
                        : __typeof
          break
        case 'b': // Boolean
          ptr.ctype = 'boolean'
          ptr.match = __typeof
          break
        case 'c': // Function: same as 't' with Function specified, although
                  // uses typeof 'function' rather than instanceof Function
          ptr.ctype = 'function'
          ptr.match = __typeof
          break
        case 'o': // Object: same as 't' with Object specified, although
                  // uses typeof 'object' rather than instanceof Object
                  // Matches initialized objects only, not function-objects
          ptr.ctype = 'object'
          ptr.match = __typeof
          break
        case 'a': // Array: same as 't' with Array specified, but lets us skip the object argument.
          ptr.ctype = Array
          ptr.match = __ctype
          break
        case 't': // Function, Date, RegExp, etc, or even a custom type. Defaults to Object
          ptr.ctype = Object
          ptr.match = __ctype
          break
      }
    } else if (typeof args[a] == 'function') {
      if (~current) ptr = argslist[current]
      else throw TypeError('Argtype element ' + a +
                           ' was not of expected type')
      // If the current arg is a 't'-type this is either a default or a type
      if (ptr.type == 't') ptr.ctype == Function ? ptr.default = args[a] : ptr.ctype = args[a]
      // However, if it's a 'c'-type or untyped then this can only be a default
      else if (ptr.type == 'c' || ptr.type == '.') ptr.default = args[a]
    } else if (argslist[current].match(args[a]) || (!argslist[current].notnull && args[a] === null)) {
      argslist[current].default = args[a]
    } else {
      throw new TypeError('Argtype element ' + a +
                          ' was not of expected type')
    }
  }
  
  delete a, len, current, ptr, re, matches, args
  
  return function() {
    var array = []
    if (_checkRecursive((new Array(arguments)).slice(0), argslist, array)) {
      return func.apply(thisObj, array)
    }
    throw new TypeError('Argument missing or wrong type')
  }
}

// Yo dawg...
argtype = argtype(module, ['?0o', null, 'a>0', 'c'], argtype)
module.exports = argtype
