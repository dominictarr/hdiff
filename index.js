/*

hmm, so how to do diffs?

Decide how to display this in the ui, and then work backwards.
So, I'm guessing... display everything, but highlight deletes as red,
and additions as green.

# types

string sets,
number sets
shallow object (diff keys and values)
object list
deep object (diff keys, and internal objects)


path, del|add|update?

when you update a property, show the old property as red and new as green.
key: [new, old]

[del, path, old]
[add, path, new]

[1, 2, 3] -> [1, 4, 2, 3] = [1, 0, 4] //insert 4 at 1

[1, {$add: 4}, 2, 3]

[1, 2, 3] -> [1, 4, 3] = [1, 1, 4] //insert delete at 1, insert 4 at 1

[1, {$add: 4}, {$del: 2}, 3]

aha!

this works for diffing objects too,

{ key: 1} -> {key: 2} = {key: {$del: 1, $add: 2}}

the renderer just has to detect ${add,del} and display those objects correctly.


*/
function isDeep(o) {
  return o && (isArray(o) || (o && 'object' === typeof o))
}


function equal(a, b) {
  if(a === b)
    return true
  if(isDeep(a) && isDeep(b)) {
    //expect deep objects to match by a "name" or "id" field
    if(
      (a.name && a.name === b.name) ||
      (a.id && a.id === b.id)
    )
      return true
  }
  return false
}

var diff = require('adiff')({equal: equal}).diff

function getItem(a, name) {
  for(var i in a) {
    var v = a[i]
    if(v && isDeep(v.$add || v)) {
      var o = (v.$add || v)
      var _name = (o.name || o.id)
      if(name === _name)
        return o
    }
  }
}


function has(o, p) {
  return Object.hasOwnProperty.call(o, p)
}

function hasChange (o) {
  if(!isDeep(o))
    return false
  if(has(o, '$add') || has(o, '$del'))
    return true
  for(var k in o) {
    if(hasChange(o[k])) return true
  }
  return false
}

function mapItem (a, iter) {
  var b = new Array(a.length)
  a.forEach(function (v, k) {
    if(v && isDeep(v.$add || v)) {
      var o = (v.$add || v)
      var name = (o.name || o.id)
      if(v.$add) {
        v.$add = iter(o, name)
        b[k] = a[k]
      } else
        b[k] = iter(o, name)
    }
    else
      b[k] = a[k]
  })
  return b
}

exports = module.exports = diffObject
exports.diffArray = diffArray

function diffArray (a, b) {
  var p = diff(a, b)
  function csplice (index, del) {
    var inserts = [].slice.call(arguments, 2).map(function (e) {
      return {$add: e}
    })
    
    for(var i = 0; i < del; i++)
      this[index + i] = {$del: this[index + i]}
    inserts.unshift(0)
    inserts.unshift(index)
    this.splice.apply(this, inserts)
  }

  a = a.slice()
  p.forEach(function (p) {
    csplice.apply(a, p)
  })
  return a
}

exports.object = diffObject
exports.getItem = getItem
var isArray = Array.isArray

function isDefined (u) {
  return 'undefined' !== typeof u
}

function diffObject (a, b, opts) {
  var unchanged = !(opts && opts.unchanged === false)
  var o = {}

  //XOR
  if(!isArray(a) !== !isArray(b))
    //this should never happen
    return {$add: b, $del: a}
  else if(isArray(a) && isArray(b)) {
    var a =  mapItem(diffArray(a, b), function (x, name) {
      var y = getItem(b, name)
      if(!y) return x
      var p = diffObject(x, y, {unchanged: unchanged})
      return p
    })
    return unchanged ? a : a.filter(hasChange)
  }

  //check for add, modify, and same
  for(var k in b) {
    //check for add
    if(isDefined(b[k]) && !isDefined(a[k]))
      o[k] = {$add: b[k]}
    //check for update
    else if(b[k] !== a[k]) {
      if(isDeep(b[k]) && isDeep(a[k])) {
        o[k] = diffObject(a[k], b[k], opts)
        if(unchanged && o[k] === undefined)
          delete o[k]
      }
      else {
        o[k] = isDefined(a[k])
          ? {$add: b[k], $del: a[k]}
          : {$add: b[k]}
      }
    } else {
      if(unchanged)
        o[k] = b[k]
    }
  }

  //check for deletes
  for(var k in a) {
    if(isDefined(a[k]) && !isDefined(b[k]))
      o[k] = {$del: a[k]}
  }

  if(unchanged)
    return o
 
  for(var k in o)
    return o

  return undefined
}

