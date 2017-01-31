'use strict';

const assert = require('chai').assert;

const MultiKeyMap = require('../../lib/multikeymap');

describe('MultiKeyMap', () => {

  const key = ['a', 'b', 'c'];
  const value = 'foo';
  let map;

  beforeEach(() => {
    map = new MultiKeyMap();
    map.set(key, value);
  });

  describe('#size', () => {
    it('should be 0 one construction', () => {
      const m = new MultiKeyMap();
      assert.strictEqual(m.size, 0);
    });

    it('should increment after set', () => {
      assert.strictEqual(map.size, 1);
    });

    it('should decrement after delete', () => {
      map.delete(key);
      assert.strictEqual(map.size, 0);
    });
  });

  describe('#[Symbol.toStringTag]', () => {
    it('should be string', () => {
      assert.isString(map[Symbol.toStringTag]);
    });
  });

  describe('#[Symbol.species]', () => {
    it('should return MultiKeyMap constructor', () => {
      assert.strictEqual(MultiKeyMap[Symbol.species], MultiKeyMap);
    });

    it('should be constructable as MultiKeyMap', () => {
      const Species = MultiKeyMap[Symbol.species];
      const species = new Species();
      assert.instanceOf(species, MultiKeyMap);
    });
  });

  describe('#clear', () => {
    it('should set size to 0', () => {
      map.clear();
      assert.strictEqual(map.size, 0);
    });

    it('should make all entries ungettable', () => {
      map.clear();
      const result = map.get(key);
      assert.isNotOk(result);
    });
  });

  describe('#delete', () => {
    it('should throw if keys not array', () => {
      assert.throws(() => {
        map.delete(42);
      }, TypeError);
    });

    it('should result in item not being gettable', () => {
      map.delete(key);
      const result = map.get(key);
      assert.isNotOk(result);
    });

    it('should decrement size', () => {
      map.delete(key);
      assert.strictEqual(map.size, 0);
    });

    it('should return true if removed', () => {
      const result = map.delete(key);
      assert.isTrue(result);
    });

    it('should return false if not removed', () => {
      const result = map.delete(['nope']);
      assert.isFalse(result);
    });

    it('should return false if keys length is 0', () => {
      const result = map.delete([]);
      assert.isFalse(result);
    });
  });

  describe('#entries', () => {
    it('should return iterator', () => {
      const iterator = map.entries();
      assert.isFunction(iterator.next);
    });

    it('should return object on next', () => {
      const iterator = map.entries();
      const item = iterator.next();
      assert.isObject(item);
    });

    it('should return object with done=false on first iteration', () => {
      const iterator = map.entries();
      const item = iterator.next();
      assert.isFalse(item.done);
    });

    it('should return object with done=true on last iteration', () => {
      const iterator = map.entries();
      iterator.next();
      const item = iterator.next();
      assert.isTrue(item.done);
    });

    it('should return object with value on iteration', () => {
      const iterator = map.entries();
      const item = iterator.next();
      assert.property(item, 'value');
    });

    it('should return object value of array on iteration', () => {
      const iterator = map.entries();
      const item = iterator.next();
      assert.isArray(item.value);
    });

    it('should return object value of array[0]=key on iteration', () => {
      const iterator = map.entries();
      const item = iterator.next();
      assert.strictEqual(item.value[0], key);
    });

    it('should return object value of array[1]=value on iteration', () => {
      const iterator = map.entries();
      const item = iterator.next();
      assert.strictEqual(item.value[1], value);
    });
  });

  describe('#forEach', () => {
    it('should throw if callback not function', () => {
      assert.throws(() => {
        map.forEach(42);
      }, TypeError);
    });

    it('should execute callback for each entry', () => {
      let count = 0;
      map.forEach(() => count++);
      assert.strictEqual(count, 1);
    });

    it('should execute callback with key as first argument', () => {
      map.forEach((keys, val, m) => {
        assert.strictEqual(keys, key);
      });
    });

    it('should execute callback with value as second argument', () => {
      map.forEach((keys, val, m) => {
        assert.strictEqual(val, value);
      });
    });

    it('should execute callback with instance as third argument', () => {
      map.forEach((keys, val, m) => {
        assert.strictEqual(m, map);
      });
    });

    it('should execute callback with this context when provided', () => {
      const self = { a: 'b' };
      map.forEach(function(keys, val, m) {
        assert.strictEqual(this, self);
      }, self);
    });
  });

  describe('#get', () => {
    it('should throw if keys not array', () => {
      assert.throws(() => {
        map.get(42);
      }, TypeError);
    });

    it('should return value when found', () => {
      const result = map.get(key);
      assert.strictEqual(result, value);
    });

    it('should return undefined when not found', () => {
      const result = map.get(['blorg']);
      assert.isNotOk(result);
    });

    it('should return undefined with empty map', () => {
      const m = new MultiKeyMap();
      const result = m.get(key);
      assert.isNotOk(result);
    });

    it('should return undefined if keys length is 0', () => {
      const result = map.get([]);
      assert.isNotOk(result);
    });
  });

  describe('#has', () => {
    it('should throw if keys not array', () => {
      assert.throws(() => {
        map.has(42);
      }, TypeError);
    });

    it('should return true if key exists', () => {
      const result = map.has(key);
      assert.isTrue(result);
    });

    it('should return false if key does not exist', () => {
      const result = map.has(['nope']);
      assert.isFalse(result);
    });
  });

  describe('#keys', () => {
    it('should return iterator', () => {
      const iterator = map.keys();
      assert.isFunction(iterator.next);
    });

    it('should return object on next', () => {
      const iterator = map.keys();
      const item = iterator.next();
      assert.isObject(item);
    });

    it('should return object with done=false on first iteration', () => {
      const iterator = map.keys();
      const item = iterator.next();
      assert.isFalse(item.done);
    });

    it('should return object with done=true on last iteration', () => {
      const iterator = map.keys();
      iterator.next();
      const item = iterator.next();
      assert.isTrue(item.done);
    });

    it('should return object with value on iteration', () => {
      const iterator = map.keys();
      const item = iterator.next();
      assert.property(item, 'value');
    });

    it('should return object value of array on iteration', () => {
      const iterator = map.keys();
      const item = iterator.next();
      assert.isArray(item.value);
    });

    it('should return object value of key on iteration', () => {
      const iterator = map.keys();
      const item = iterator.next();
      assert.strictEqual(item.value, key);
    });

    it('should iterate with value as array', () => {
      const iterator = map.keys();

      for (let value of iterator) {
        assert.isArray(value);
        return;
      }
    });

    it('should iterate with value of key', () => {
      const iterator = map.keys();

      for (let value of iterator) {
        assert.strictEqual(value, key);
        return;
      }
    });

    it('should iterate once for each entry', () => {
      const iterator = map.keys();
      let count = 0;

      for (let value of iterator) {
        count++;
      }

      assert.strictEqual(count, 1);
    });
  });

  describe('#set', () => {
    it('should throw if keys not array', () => {
      assert.throws(() => {
        map.set(42, 'hi');
      }, TypeError);
    });

    it('should throw if no value argument', () => {
      assert.throws(() => {
        map.set([42]);
      }, TypeError);
    });

    it('should add item when it does not exist', () => {
      const k = ['x', 'y'];
      const v = 42;
      map.set(k, v);
      const result = map.get(k);
      assert.strictEqual(result, v);
    });

    it('should update item if it exists', () => {
      const v = 'bar';
      map.set(key, v);
      const result = map.get(key);
      assert.strictEqual(result, v);
    });

    it('should increment size if item does not exist', () => {
      const current = map.size;
      map.set(['x', 'y'], 42);
      assert.strictEqual(map.size, current + 1);
    });

    it('should not increment size if item exists', () => {
      const current = map.size;
      map.set(key, 42);
      assert.strictEqual(map.size, current);
    });
  });

  describe('#traverse', () => {
    it('should return traversor', () => {
      const traversor = map.traverse();
      assert.isFunction(traversor.next);
    });

    it('should return object on next', () => {
      const traversor = map.traverse();
      const result = traversor.next(key[0]);
      assert.isObject(result);
    });

    it('should return object with done=false on valid next', () => {
      const traversor = map.traverse();
      const result = traversor.next(key[0]);
      assert.isFalse(result.done);
    });

    it('should return object with value on valid next', () => {
      const traversor = map.traverse();
      const result = traversor.next(key[0]);
      assert.property(result, 'value');
    });

    it('should return object with value=value on next with value', () => {
      const traversor = map.traverse();
      traversor.next(key[0]);
      traversor.next(key[1]);
      const result = traversor.next(key[2]);
      assert.strictEqual(result.value, value);
    });

    it('should return object with done=true on next after leaf', () => {
      const traversor = map.traverse();
      traversor.next(key[0]);
      traversor.next(key[1]);
      traversor.next(key[2]);
      const result = traversor.next('blorg');
      assert.isTrue(result.done);
    });

    it('should return object with done=true on invalid key on next', () => {
      const traversor = map.traverse();
      const result = traversor.next('blorg');
      assert.isTrue(result.done);
    });

    it('should return object with value=undefined on bridge next', () => {
      const traversor = map.traverse();
      const result = traversor.next(key[0]);
      assert.isNotOk(result.value);
    });

    it('should return object with done=true on successive invalid next', () => {
      const traversor = map.traverse();
      traversor.next(key[0]);
      traversor.next(key[1]);
      traversor.next(key[2]);
      traversor.next('blorg');
      const result = traversor.next('ugh');
      assert.isTrue(result.done);
    });
  });

  describe('#values', () => {
    it('should return iterator', () => {
      const iterator = map.values();
      assert.isFunction(iterator.next);
    });

    it('should return object on next', () => {
      const iterator = map.values();
      const item = iterator.next();
      assert.isObject(item);
    });

    it('should return object with done=false on first iteration', () => {
      const iterator = map.values();
      const item = iterator.next();
      assert.isFalse(item.done);
    });

    it('should return object with done=true on last iteration', () => {
      const iterator = map.values();
      iterator.next();
      const item = iterator.next();
      assert.isTrue(item.done);
    });

    it('should return object with value on iteration', () => {
      const iterator = map.values();
      const item = iterator.next();
      assert.property(item, 'value');
    });

    it('should return object value of value on iteration', () => {
      const iterator = map.values();
      const item = iterator.next();
      assert.strictEqual(item.value, value);
    });
  });

  describe('#[Symbol.iterator]', () => {
    it('should return iterator', () => {
      const iterator = map[Symbol.iterator]();
      assert.isFunction(iterator.next);
    });

    it('should return object on next', () => {
      const iterator = map[Symbol.iterator]();
      const item = iterator.next();
      assert.isObject(item);
    });

    it('should return object with done=false on first iteration', () => {
      const iterator = map[Symbol.iterator]();
      const item = iterator.next();
      assert.isFalse(item.done);
    });

    it('should return object with done=true on last iteration', () => {
      const iterator = map[Symbol.iterator]();
      iterator.next();
      const item = iterator.next();
      assert.isTrue(item.done);
    });

    it('should return object with value on iteration', () => {
      const iterator = map[Symbol.iterator]();
      const item = iterator.next();
      assert.property(item, 'value');
    });

    it('should return object value of array on iteration', () => {
      const iterator = map[Symbol.iterator]();
      const item = iterator.next();
      assert.isArray(item.value);
    });

    it('should return object value of array[0]=key on iteration', () => {
      const iterator = map[Symbol.iterator]();
      const item = iterator.next();
      assert.strictEqual(item.value[0], key);
    });

    it('should return object value of array[1]=value on iteration', () => {
      const iterator = map[Symbol.iterator]();
      const item = iterator.next();
      assert.strictEqual(item.value[1], value);
    });

    it('should iterate with value as array', () => {
      for (let val of map) {
        assert.isArray(val);
        return;
      }
    });

    it('should iterate with value of array[0]=key', () => {
      for (let val of map) {
        assert.strictEqual(val[0], key);
        return;
      }
    });

    it('should iterate with value of array[1]=value', () => {
      for (let val of map) {
        assert.strictEqual(val[1], value);
        return;
      }
    });

    it('should iterate once for each entry', () => {
      let count = 0;

      for (let val of map) {
        count++;
      }

      assert.strictEqual(count, 1);
    });
  });

});
