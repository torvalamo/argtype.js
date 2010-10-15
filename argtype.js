function checkType(value, type) {
  if (type instanceof RegExp) return type.match(value)
  else if (type === 'regexp') return value instanceof RegExp
  else if (type === 'array') return value instanceof Array
  else return typeof value === type
}

exports.checkArguments = function(args, names, types) {
  var a = 0, out = {}
  if (!(names instanceof Array) || !(types instanceof Array)) {
    // argument checking the argument checker ;)
    // i could do this recursively, but it's slow enough as it is :p
    return out
  }
  for (var t = 0; t < types.length; t++) {
    var opt = types[t] instanceof Array,
      type = opt ? types[t][0] : types[t]
    if (!checkType(args[a], type)) { // wrong type
      if (!opt || (args[a] !== undefined && t == types.length - 1)) {
        // required or end optional, error
        throw new Error('Wrong argument type (argument ' + (a + 1) +
                        ' got ' + (typeof args[a]) + ', expected ' + type +
                        ').')
      } else {
        // optional, skip to next format
        out[names[t]] = undefined
      }
    } else {
      // right type, move to next argument
      out[names[t]] = args[a++]
    }
  }
  return out
}