

var change = require('../')
var tape = require('tape')

tape('update', function (t) {

  var e = { A: 1, B: { '$add': 3, '$del': 2 }, C: { '$add': 6 } }

  var p = change({
    A: 1, B: 2
  }, {
    A: 1, B: 3, C: 6
  })

  console.log(p)
  t.deepEqual(p, e)
  t.end()
})

tape('update / delete ', function (t) {

  var e = { A: 1, C: { '$add': 6 }, B: { '$del': 2 } }

  var p2 = change({
    A: 1, B: 2
  }, {
    A: 1, C: 6
  })

  console.log(p2)
  t.deepEqual(p2, e)
  t.end()

})

tape('array del', function (t) {

  var e = { A: 1, C: { '$add': [ 1, 3, 4 ] }, B: { '$del': 2 } }

  var p3 = change({
    A: 1, B: 2
  }, {
    A: 1, C: [1, 3, 4]
  })

  console.log(p3)
  t.deepEqual(p3, e)
  t.end()
})

tape('array 2', function (t) {

  var e = { A: 1, C: [ 1, { '$del': 4 }, 3, 4 ], B: { '$del': 2 } }

  var p3 = change({
    A: 1, B: 2, C: [1, 4, 3, 4]
  }, {
    A: 1, C: [1, 3, 4]
  })

  console.log(p3)
  t.deepEqual(p3, e)
  t.end()

})


