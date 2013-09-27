

var change = require('../')
var tape = require('tape')

tape('simple', function (t) {
  var p = change([
    {name: 'a1', A: 1, B: 2},
    {name: 'b2', A: 1, B: 2},
    {name: 'c3', A: 1, B: 2},
  ], [
    {name: 'a1', A: 1, B: 5},
  //  {name: 'b2', A: 1, B: 2},
    {name: 'd4', x: ['A', 'C', 'B']},
    {name: 'c3', A: 1, B: 2},
  ])

  var expected = [
      { name: "a1",
        A: 1, B: { $add: 5, $del: 2 }
      },
      { $add: {
          name: "d4",
          x: [ "A", "C", "B" ]
        }
      },
      { $del: { name: "b2", A: 1, B: 2 } },
      { name: "c3", A: 1, B: 2 }
    ]

  t.deepEqual(p, expected)
  //console.log(JSON.stringify(p, null, 2))
  t.end()
})

tape('more complex', function (t) {

  var p = change(
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
  })

  var expected = {
    foo: [
      {
        name: "a1",
        A: 1,
        B: { "$add": 5, "$del": 2 }
      },
      { $del: { "name": "b2", "A": 1, "B": 2 } },
      { name: "c3", A: 1, B: 2 },
      {
        name: "d4",
        x: [ "A", { $add: "B" }, "C", { $del: "B" }]
      }
    ],
    bar: {
      $add: { baz: true }
    }
  }
  t.deepEqual(p, expected)
  t.end()

})


