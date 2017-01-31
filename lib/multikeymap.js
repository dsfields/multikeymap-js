'use strict';

class Iterator {

  constructor(map, justValue) {
    this._map = map;
    this._current = -1;
    this._justValue = justValue;
  }


  next() {
    this._current++;

    if (this._current >= this._map._keys.length)
      return { done: true };

    const keys = this._map._keys[this._current];
    const value = this._map.get(keys);

    if (this._justValue) return { done: false, value: value };

    return { done: false, value: [ keys, value ] };
  }

}


class Traversor {

  constructor(node) {
    this._node = node;
    this._done = false;
    this._current = undefined;
  }


  next(key) {
    if (this._done) return this._current;

    this._node = this._node.neighbors.get(key);

    if (typeof this._node === 'undefined') {
      this._done = true;
      this._current = { done: true };
      return this._current;
    }

    const value = (typeof this._node.data === 'undefined')
      ? undefined
      : this._node.data.value;

    this._current = { done: false, value: value };

    return this._current;
  }

}


class MultiKeyMap {

  constructor() {
    this._keys = [];
    this._root = { neighbors: new Map() };
  }


  get size() { return this._keys.length; }


  get [Symbol.toStringTag]() { return 'MultiKeyMap'; }


  static get [Symbol.species]() { return MultiKeyMap; }


  _assertKeys(keys) {
    if (!Array.isArray(keys))
      throw new TypeError('Argument "keys" must be an array');
  }


  _assertCallback(callback) {
    if (typeof callback !== 'function')
      throw new TypeError('Argument "calback" must be a function');
  }


  clear() {
    this._root.neighbors.clear();
    this._keys = [];
  }


  delete(keys) {
    const result = this._delete(keys, this._root);
    if (result.deleted) {
      this._deleteKeys(result.keys);
      return true;
    }

    return false;
  }


  _delete(keys, node) {
    this._assertKeys(keys);

    if (keys.length === 0) return false;

    let result = {
      deleted: false,
      keys: undefined,
    };

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let nextNode = node.neighbors.get(key);

      if (typeof nextNode === 'undefined') continue;

      if (keys.length === 1) {
        if (typeof nextNode.data !== 'undefined') {
          result.deleted = true;
          result.keys = nextNode.data.keys;
          nextNode.data = undefined;
        }
      } else {
        const copy = keys.slice();
        copy.splice(i, 1);
        const res = this._delete(copy, nextNode);
        if (res.deleted) result = res;
      }

      if (nextNode.neighbors.size === 0)
        node.neighbors.delete(key);
    }

    return result;
  }


  _deleteKeys(keys) {
    for (let i = 0; i < this._keys.length; i++) {
      if (this._keys[i] === keys) {
        this._keys.splice(i, 1);
        return;
      }
    }
  }


  entries() {
    return new Iterator(this, false);
  }


  forEach(callback, self) {
    this._assertCallback(callback);

    const keys = this._keys;
    const setSelf = (typeof self !== 'undefined' && self !== null);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.get(key);
      if (setSelf) callback.call(self, key, value, this)
      else callback(key, value, this);
    }
  }


  get(keys) {
    const result = this._get(keys);
    if (typeof result === 'undefined') return undefined;
    return result.value;
  }


  _get(keys) {
    this._assertKeys(keys);
    if (keys.length === 0) return undefined;

    let node = this._root;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      node = node.neighbors.get(key);
      if (typeof node === 'undefined') return undefined;
    }

    return node.data;
  }


  has(keys) {
    return (typeof this._get(keys) !== 'undefined');
  }


  keys() {
    return this._keys[Symbol.iterator]();
  }


  set(keys, value) {
    this._assertKeys(keys);

    if (arguments.length < 2)
      throw new TypeError('The "value" argument is required');

    const added = this._set(keys, keys, value, this._root);

    if (added) this._keys.push(keys);

    return this;
  }


  _set(base, keys, value, node) {
    let added = false;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let nextNode = node.neighbors.get(key);

      if (typeof nextNode === 'undefined') {
        nextNode = {
          data: undefined,
          neighbors: new Map(),
        };

        node.neighbors.set(key, nextNode);
      }

      if (keys.length === 1) {
        added = (typeof nextNode.data === 'undefined');
        nextNode.data = {
          value: value,
          keys: base,
        };
        return added;
      }

      const copy = keys.slice();
      copy.splice(i, 1);

      added = this._set(base, copy, value, nextNode);
    }

    return added;
  }


  traverse() {
    return new Traversor(this._root);
  }


  values() {
    return new Iterator(this, true);
  }


  [Symbol.iterator]() {
    return this.entries();
  }

}

module.exports = MultiKeyMap;
