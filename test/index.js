var expect = require('chai').expect
  , diff = require('..');

describe('changeset', function () {
  beforeEach(function (done) {
    done();
  });

  it('should be able to diff two objects and return a changeset',
    function (done) {
      var a = {
        name: 'Eugene',
        number: 42,
        tags: ['tag1', 'tag2', 'tag3'],
        scores: {
          tetris: 1000,
          carmageddon: 3
        }
      };

      a.self = a;
      a.scoresAgain = a.scores;

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

      b.friend = a;
      b.self = b;

      var changes = diff(a, b);
      expect(changes).to.deep.equal([
        { type: 'put', key: ['name'], value: 'Susan' },
        { type: 'put', key: ['number'], value: 43 },
        { type: 'put', key: ['tags', '1'], value: 'tag4' },
        { type: 'del', key: ['tags', '2'] },
        { type: 'del', key: ['scores', 'tetris'] },
        { type: 'put', key: ['scores', 'zelda'], value: 3000 },
        { type: 'put', key: ['self'], value: b },
        { type: 'del', key: ['scoresAgain'], },
        { type: 'put', key: ['age'], value: 37 },
        { type: 'put', key: ['friend'], value: a }
      ]);

      done();
    });

  it('should be able to handle basic types', function (done) {
    var a = 'Eugene';
    var b = 'Susan';

    var changes = diff(a, b);
    expect(changes).to.deep.equal([
      { type: 'put', key: [], value: 'Susan' }
    ]);

    done();
  });

  it('should be able to handle nulls', function (done) {
    var changes;

    changes = diff(null, 'Susan');
    expect(changes).to.deep.equal([
      { type: 'put', key: [], value: 'Susan' }
    ]);

    changes = diff('Eugene', null);
    expect(changes).to.deep.equal([
      { type: 'put', key: [], value: null }
    ]);

    done();
  });

  it('should be able to handle undefined', function (done) {
    var changes;

    changes = diff(undefined, 'Susan');
    expect(changes).to.deep.equal([
      { type: 'put', key: [], value: 'Susan' }
    ]);

    changes = diff('Eugene', undefined);
    expect(changes).to.deep.equal([
      { type: 'del', key: [] }
    ]);

    done();
  });

  it('should be able to apply a changeset to an object', function (done) {
    var a = {
      name: 'Eugene',
      number: 42,
      tags: ['tag1', 'tag2', 'tag3'],
      scores: {
        tetris: 1000,
        carmageddon: 3
      }
    };

    a.self = a;
    a.scoresAgain = a.scores;

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

    b.friend = a;
    b.self = b;

    var clone = require("udc");
    var bClone = clone(b);

    var changes = diff(a, b);
    var b_ = diff.apply(changes, a);
    expect(b_).to.deep.equals(b);
    expect(b).to.deep.equals(bClone); // Target did not change.
    done();
  });

  it('should be able to apply a changeset to a value', function (done) {
    var a = 'Eugene';
    var b = 'Susan';

    var changes = diff(a, b);
    var b_ = diff.apply(changes, a);
    expect(b_).to.deep.equals(b);
    done();
  });

  it('should be able to apply a changeset with nulls', function (done) {
    var changes, b_;

    changes = diff(null, 'Susan');
     b_ = diff.apply(changes, null);
    expect(b_).to.deep.equals('Susan');

    changes = diff('Eugene', null);
     b_ = diff.apply(changes, 'Eugene');
    expect(b_).to.deep.equals(null);

    done();
  });

  it('should be able to apply a changeset with undefined', function (done) {
    var changes, b_;

    changes = diff(undefined, 'Susan');
     b_ = diff.apply(changes, undefined);
    expect(b_).to.deep.equals('Susan');

    changes = diff('Eugene', undefined);
     b_ = diff.apply(changes, 'Eugene');
    expect(b_).to.deep.equals(null);

    done();
  });

  it('should be able to apply a changeset to an object and modify it',
      function (done) {
        var a = {
          name: 'Eugene',
          number: 42,
          tags: ['tag1', 'tag2', 'tag3'],
          scores: {
            tetris: 1000,
            carmageddon: 3
          }
        };

        a.self = a;
        a.scoresAgain = a.scores;

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

        b.friend = a;
        b.self = b;

        var changes = diff(a, b);
        var b_ = diff.apply(changes, a, true);
        expect(b_).to.deep.equals(b);
        expect(b_).to.equal(a);
        done();
    });

  it('should be able to self-modify and replace an entire object',
    function(done) {
      var data = { name: 'Eugene', number: 43 };
      var change = [ { type: 'put', key: [], value: 'xxx' } ];
      var obj = diff.apply(change, data, true);
      expect(obj).to.equal('xxx');
      done();
    });
});
