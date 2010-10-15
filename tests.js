// Tests use nodeunit (http://github.com/caolan/nodeunit)

var _ = require('./argtype').checkArguments

exports.noArguments = function(test) {
  test.deepEqual(_(), {})
  test.done()
}

exports.onlyArgumentsArgument = function(test) {
  test.deepEqual(_(arguments), {})
  test.done()
}

exports.noNamedArgumentsOrTypes = function(test) {
  test.deepEqual(_(arguments, []), {})
  test.deepEqual(_(arguments, [], []), {})
  test.throws(_(arguments, [], ['number']), 'Wrong argument type (argument 1 got null, expected number).')
  test.done()
}

// TODO: More tests.