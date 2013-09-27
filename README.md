# hdiff

Human Readable JSON diff.

[![travis](https://travis-ci.org/dominictarr/hdiff.png?branch=master)
](https://travis-ci.org/dominictarr/hdiff)

[![testling](http://ci.testling.com/dominictarr/hdiff.png)
](http://ci.testling.com/dominictarr/hdiff)

Diff json objects in a human readable way,
each change is wrapped in an object with an `$add` and/or
`$del` properties.

objects within an array require a `name` or `id` property (see below)
otherwise, primitives within arrays are diffed as normal.

``` js
  var hdiff = require('hdiff')

  var p = 
  hdiff(
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

  console.log(p)
```
outputs:
``` js
[
  {
    name: "a1",
    A: 1, B: { $add: 5, $del: 2 }
  },
  {
    $add: {
      name: "d4",
      x: [ "A", "C", "B" ]
    }
  },
  {
    $del: { name: "b2", A: 1, B: 2 } 
  },
  {
    name: "c3", A: 1, B: 2 
  }
]
```

# Objects within Arrays

Objects within arrays are diffed specially.
It is ambigous if an object within an array has both moved and changed,
so this is necessary.

## License

MIT
