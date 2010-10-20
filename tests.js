// Tests use nodeunit (http://github.com/caolan/nodeunit)

var argtype = require('./argtype')

exports.missingCreateArguments = function(test) {
  var emptyFunc = function(){}
    , emptyObj  = {}
    , emptyArr  = []
  test.throws(function(){argtype()})
  test.throws(function(){argtype(emptyObj)})
  test.throws(function(){argtype(emptyFunc)})
  test.throws(function(){argtype(emptyArr)})
  test.throws(function(){argtype(emptyObj, emptyFunc)})
  test.throws(function(){argtype(emptyObj, emptyArr)})
  test.throws(function(){argtype(emptyFunc, emptyObj)})
  test.throws(function(){argtype(emptyArr, emptyObj)})
  test.done()
}

exports.correctCreateArguments = function(test) {
  var emptyFunc = function(){}
    , emptyObj  = {}
    , emptyArr  = []
    , emptyRegex = /^$/
  test.doesNotThrow(function(){argtype(emptyObj, emptyFunc, ['string'])})
  test.doesNotThrow(function(){argtype(emptyObj, ['number'], emptyFunc)})
  test.doesNotThrow(function(){argtype(emptyObj, emptyFunc, [emptyRegex])})
  test.doesNotThrow(function(){argtype(emptyObj, [['string', 'default']], emptyFunc)})
  test.doesNotThrow(function(){argtype(emptyObj, emptyArr, function(a, b){})})
  test.doesNotThrow(function(){argtype(emptyObj, function(a, b){}, ['string'])})
  test.doesNotThrow(function(){argtype(emptyObj, ['number', ['string'], 'object'], emptyFunc)})
  test.doesNotThrow(function(){argtype(emptyObj, [['string', 'default']], function(a, b){})})
  test.done()
}

exports.incorrectCreateArguments = function(test) {
  var emptyFunc = function(){}
    , emptyObj  = {}
    , emptyArr  = []
    , emptyRegex = /^$/
  test.throws(function(){argtype(emptyFunc, emptyArr, emptyFunc)})
  test.throws(function(){argtype(1, emptyArr, emptyFunc)})
  test.throws(function(){argtype('string', emptyArr, emptyFunc)})
  test.throws(function(){argtype(emptyRegex, emptyArr, emptyFunc)})
  test.throws(function(){argtype(emptyObj, 1, emptyFunc)})
  test.throws(function(){argtype(emptyObj, 'string', emptyFunc)})
  test.throws(function(){argtype(emptyObj, emptyRegex, emptyFunc)})
  test.throws(function(){argtype(emptyObj, emptyArr, 1)})
  test.throws(function(){argtype(emptyObj, emptyArr, 'string')})
  test.throws(function(){argtype(emptyObj, emptyArr, emptyRegex)})
  test.done()
}

exports.runEmpty = function(test) {
  var tmp = 0
    , arr = []
    , obj = {}
    , funcVar = argtype(null, [], function(){tmp++})
    , funcArr = argtype(arr, [], function(a){arr.push(a)})
    , funcArrThis = argtype(arr, [], function(a){this.push(a)})
    , funcObj = argtype(obj, [], function(a, b){obj[a] = b})
    , funcObjThis = argtype(obj, [], function(a, b){this[a] = b})
  test.doesNotThrow(function(){funcVar()})
  test.equal(tmp, 1)
  test.doesNotThrow(function(){funcArr('a')})
  test.deepEqual(arr, ['a'])
  test.doesNotThrow(function(){funcArrThis('b')})
  test.deepEqual(arr, ['a', 'b'])
  test.doesNotThrow(function(){funcObj('a', 'b')})
  test.deepEqual(obj, {'a':'b'})
  test.doesNotThrow(function(){funcObjThis('c', 'd')})
  test.deepEqual(obj, {'a':'b', 'c': 'd'})
  test.doesNotThrow(function(){funcObj('a', 'e')})
  test.deepEqual(obj, {'a':'e', 'c': 'd'})
  test.doesNotThrow(function(){funcObjThis('c', 'f')})
  test.deepEqual(obj, {'a':'e', 'c': 'f'})
  test.done()
}

// The following tests are incomplete
// In particular they need more advanced multi-option tests

exports.createAndRunGood = function(test) {
  var tmp = 0
    , arr = []
    , funcVar = argtype(null, ['number'], function(inc){tmp += inc})
    , funcREx = argtype(null, [/^[a-z]+$/], function(str){arr.push(str)})
    , funcMulti = argtype(null, ['string', 'object'], function(){})
  test.doesNotThrow(function(){funcVar(0)})
  test.doesNotThrow(function(){funcVar(3)})
  test.doesNotThrow(function(){funcVar(10)})
  test.doesNotThrow(function(){funcVar(-5)})
  test.equal(tmp, 8)
  test.doesNotThrow(function(){funcREx('something')})
  test.deepEqual(arr, ['something'])
  test.doesNotThrow(function(){funcMulti('something', {})})
  test.done()
}

exports.createAndRunGoodOptional = function(test) {
  // call with optionals missing and testing for defaults
  var tmp = 0
    , arr = []
    , arrA = []
    , arrB = []
    , funcVar = argtype(null, [['number', 1]], function(inc){tmp += inc})
    , funcREx = argtype(null, [[/^[a-z]+$/], 'number'], function(elem){arr.push(elem)})
    , funcMulti = argtype(null, ['string', ['function', function(elem){arrB.push(elem)}]], function(elem, func){func(elem)})
  test.doesNotThrow(function(){funcVar(5)})
  test.equal(tmp, 5)
  test.doesNotThrow(function(){funcVar()})
  test.equal(tmp, 6)
  test.doesNotThrow(function(){funcREx(5)})
  test.deepEqual(arr, [undefined])
  test.doesNotThrow(function(){funcREx('a', 123)})
  test.deepEqual(arr, [undefined, 'a'])
  test.doesNotThrow(function(){funcMulti('a', function(elem){arrA.push(elem)})})
  test.deepEqual(arrA, ['a'])
  test.deepEqual(arrB, [])
  test.doesNotThrow(function(){funcMulti('b')})
  test.deepEqual(arrA, ['a'])
  test.deepEqual(arrB, ['b'])
  test.done()
}

exports.createAndRunBad = function(test) {
  var tmp = 0
    , arr = []
    , funcVar = argtype(null, ['number'], function(inc){tmp += inc})
    , funcREx = argtype(null, [/^[a-z]+$/], function(str){arr.push(str)})
  test.throws(function(){funcVar()})
  test.throws(function(){funcVar('string')})
  test.throws(function(){funcVar([])})
  test.throws(function(){funcVar({})})
  test.equal(tmp, 0)
  test.throws(function(){funcREx()})
  test.throws(function(){funcREx(123)})
  test.throws(function(){funcREx('123')})
  test.throws(function(){funcREx([])})
  test.throws(function(){funcREx({})})
  test.deepEqual(arr, [])
  test.done()
}

exports.createAndRunBadOptional = function(test) {
  var tmp = 0
    , funcVar = argtype(null, [['number']], function(inc){if (inc) {tmp++} else {tmp--}})
  test.doesNotThrow(function(){funcVar()})
  test.doesNotThrow(function(){funcVar('string')})
  test.doesNotThrow(function(){funcVar([])})
  test.doesNotThrow(function(){funcVar({})})
  test.equal(tmp, -4)
  test.done()
}

// Todo, probably needs more tests
