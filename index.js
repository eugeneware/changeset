var equals = require('deep-equal')
  , _ = require('underscore');
// a = old, b = new
module.exports = diff;
function diff(old, new_) {
  var changes = [];

  changes = changes.concat(compare([], old, new_));

  return changes;
}

function delCheck(op) {
  if (op.type === 'put' && op.value === undefined) {
    op.type = 'del';
    delete op.value;
  }
  return op;
}

function compare(path, old, new_) {
  var changes = [];
  if (old !== null && new_ !== null && typeof old === 'object') {
    var oldKeys = Object.keys(old);
    var newKeys = Object.keys(new_);

    var sameKeys = _.intersection(oldKeys, newKeys);
    sameKeys.forEach(function (k) {
      var childChanges = compare(path.concat(k), old[k], new_[k]);
      changes = changes.concat(childChanges);
    });

    var delKeys = _.difference(oldKeys, newKeys);
    delKeys.forEach(function (k) {
      changes.push({ type: 'del', key: path.concat(k) });
    });

    var newKeys_ = _.difference(newKeys, oldKeys);
    newKeys_.forEach(function (k) {
      changes.push(delCheck(
        { type: 'put', key: path.concat(k), value: new_[k] }));
    });

  } else if (old !== new_) {
    changes.push(delCheck({ type: 'put', key: path, value: new_ }));
  }

  return changes;
}
