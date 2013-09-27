
var tape = require('tape')

var change = require('../').diffArray

tape('simple', function (t) {
  var p = change([1, 2, 3], [1, 4, 2, 3])
  console.log(p)
  t.deepEqual(p, [1, {$add: 4}, 2, 3])
 
  var p2 = change([1, 2, 3], [1, 4, 3])
  t.deepEqual(p2, [1, {$add: 4}, {$del:2}, 3])
  console.log(p2)
  t.end()
})

tape('start', function (t) {
  var p = change([1, 2, 3], [2, 3])
  console.log(p)
  t.deepEqual(p, [{$del: 1}, 2, 3])
  var p = change([1, 2, 3], [4, 2, 3])
  console.log(p)
  t.deepEqual(p, [{$add: 4}, {$del: 1}, 2, 3])
  t.end()
})


tape('end', function (t) {
  var p = change([1, 2, 3], [1, 2, 4])
  console.log(p)
  t.deepEqual(p, [1, 2, {$add: 4}, {$del: 3}])
  t.end()
})

tape('append', function (t) {
  var p = change([1, 2, 3], [1, 2, 3, 4])
  console.log(p)
  t.deepEqual(p, [1, 2, 3, {$add: 4}])
  t.end()
})

tape('prepend', function (t) {
  var p = change([1, 2, 3], [0, 1, 2, 3])
  console.log(p)
  t.deepEqual(p, [{$add: 0}, 1, 2, 3])
  t.end()
})


