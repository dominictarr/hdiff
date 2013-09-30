

var change = require('../')
var tape = require('tape')
/*
tape('update', function (t) {

  var e = { B: { '$add': 3, '$del': 2 }, C: { '$add': 6 } }

  var p = change({
    A: 1, B: 2
  }, {
    A: 1, B: 3, C: 6
  }, {unchanged: false})

  console.log(p)
  t.deepEqual(p, e)
  t.end()
})

tape('update / delete ', function (t) {

  var e = { C: { '$add': 6 }, B: { '$del': 2 } }

  var p2 = change({
    A: 1, B: 2
  }, {
    A: 1, C: 6
  }, {unchanged: false})

  console.log(p2)
  t.deepEqual(p2, e)
  t.end()

})

tape('array del', function (t) {

  var e = { C: { '$add': [ 1, 3, 4 ] }, B: { '$del': 2 } }

  var p3 = change({
    A: 1, B: 2
  }, {
    A: 1, C: [1, 3, 4]
  }, {unchanged: false})

  console.log(p3)
  t.deepEqual(p3, e)
  t.end()
})

tape('array 2', function (t) {

  var e = { C: [{ '$del': 4 }], B: { '$del': 2 } }

  var p3 = change({
    A: 1, B: 2, C: [1, 4, 3, 4]
  }, {
    A: 1, C: [1, 3, 4]
  }, {unchanged: false})

  console.log(p3)
  t.deepEqual(p3, e)
  t.end()

})

*/
tape('example', function (t) {

  var p = 
  change(
    {
      foo:[
        {name: 'a1', A: 1, B: 2},
        {name: 'b2', A: 1, B: 2},
        {name: 'c3', A: 1, B: 2},
        {name: 'd4', x: ['A', 'C', 'B']},
      ]
    }, {
      foo: [
        {name: 'a1', A: 1, B: 5},
        {name: 'c3', A: 1, B: 2},
        {name: 'd4', x: ['A', 'B', 'C']},
      ],
      bar: {baz: true}
    },
    {
      unchanged: false
    })

  console.log(p)

  t.deepEqual(p, {foo: [
    {
      B: { $add: 5, $del: 2 }
    },
    {"$del":{"name":"b2","A":1,"B":2}},
    {
      //would be better to represent this as a $move
      //when omiting unchanged...
      //but unless your program moves items,
      //it's not that important... post issue if it is.
      x: [ {$add: 'B'}, {$del: 'B'}]
    },
  ],
    bar: {$add: {baz: true}}
  })
  t.end()
})


tape('deep', function (t) {

  var a = {
    a: true,
    b: {
      z: 7,
      y: {
        f: {m: true},
        z: 5
      }
    }
  }
  var b = {
    a: true,
    b: {
      z: 7,
      y: {
        f: {m: false},
        z: 5
      }
    }
  }

  console.log(
    change(a, b, {unchanged: false})
  )

  console.log(
    JSON.stringify(change(a, b, {unchanged: false})))

  t.end()
})
