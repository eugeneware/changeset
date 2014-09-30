# changeset

Generate diff changesets for javascript objects, decomposing diffs into a series of puts and delete operations. The format is similar to the [levelup](https://github.com/rvagg/node-levelup) [batch](https://github.com/rvagg/node-levelup#batch) operation list for bulk operations.

Handles circular references of Objects and Arrays.

[![build status](https://secure.travis-ci.org/eugeneware/changeset.png)](http://travis-ci.org/eugeneware/changeset)

# Example

Take a diff of two objects and produce a list of transformation operations:

``` js
var diff = require('changeset');
var a = {
  name: 'Eugene',
  number: 42,
  tags: ['tag1', 'tag2', 'tag3'],
  scores: {
    tetris: 1000,
    carmageddon: 3
  }
};

var b = {
  name: 'Susan',
  number: 43,
  tags: ['tag1', 'tag4'],
  scores: {
    carmageddon: 3,
    zelda: 3000
  },
  age: 37
};

var changes = diff(a, b);
expect(changes).to.deep.equal([
  { type: 'put', key: ['name'], value: 'Susan' },
  { type: 'put', key: ['number'], value: 43 },
  { type: 'put', key: ['tags', '1'], value: 'tag4' },
  { type: 'del', key: ['tags', '2'] },
  { type: 'del', key: ['scores', 'tetris'] },
  { type: 'put', key: ['scores', 'zelda'], value: 3000 },
  { type: 'put', key: ['age'], value: 37 }
]);
```

Apply an operational changeset and apply it to an object to get a transformed object:

``` js
var diff = require('changeset');

var changes = [
  { type: 'put', key: ['name'], value: 'Susan' },
  { type: 'put', key: ['number'], value: 43 },
  { type: 'put', key: ['tags', '1'], value: 'tag4' },
  { type: 'del', key: ['tags', '2'] },
  { type: 'del', key: ['scores', 'tetris'] },
  { type: 'put', key: ['scores', 'zelda'], value: 3000 },
  { type: 'put', key: ['age'], value: 37 }
];

var a = {
  name: 'Eugene',
  number: 42,
  tags: ['tag1', 'tag2', 'tag3'],
  scores: {
    tetris: 1000,
    carmageddon: 3
  }
};

// apply the changes to a
var b_ = diff.apply(changes, a);

var b = {
  name: 'Susan',
  number: 43,
  tags: ['tag1', 'tag4'],
  scores: {
    carmageddon: 3,
    zelda: 3000
  },
  age: 37
};

// the transformed object should now equal b
expect(b_).to.deep.equals(b);
```

By default ```apply``` will return a new modified object after applying the
changeset. If you want to modify the destination, pass true as the third
parameter:

``` js
// apply the changes to a and modify a
var b_ = diff.apply(changes, a, true);
// a is now modified, and b_ is the same as a
expect(b_).to.equal(a);
```
