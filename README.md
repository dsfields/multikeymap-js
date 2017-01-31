# MultiKeyMap

A `MultiKeyMap` functions much like a hash table, but it allows you to map more than one key to a single value.  In this scenario, an entry is keyed by an array of values.  The `MultiKeyMap` class does not place requirements on the order of values to set and get values.

## Usage

Add the `multikeymap` module to your project:

```sh
$ npm install multikeymap -S
```

Then create instances of the `MultiKeyMap` class:

```js
const MultiKeyMap = require('multikeymap');

const map = new MultiKeyMap();

map.set(['a', 'b', 'c'], '123');

console.log( map.get(['a', 'b', 'c']) ); // 123
console.log( map.get(['b', 'a', 'c']) ); // 123
console.log( map.get(['c', 'a', 'b']) ); // 123
console.log( map.get(['b', 'a']) ); // undefined
```

## API

### Class: `MultiKeyMap`

The interface for the `MultiKeyMap` class looks very similar to the native ECMAScript `Map` object.

`MultiKeyMap` instances store keys and values in a directed graph structure where each vertex is a key used in a keys array, and edges point to all associated key component.  This allows for lookups of values that do not depend on key array order.

  * __Properties__

    + `MultiKeyMap.prototype.size`: the number of entries in the `MultiKeyMap` instance.

    + `MultiKeyMap.prototype[Symbol.toStringTag]`: the tag to use when stringifying the `MultiKeyMap` instance.

    + `MultiKeyMap[Symbol.species]`: a reference to the `MultiKeyMap` constructor.

  * __Methods__

    + `MultiKeyMap.prototype.clear()`: clears the contents of the `MultiKeyMap` instance.

    + `MultiKeyMap.prototype.delete(keys)`: deletes the entry associated with the given array of keys.  Returns a `Boolean` value indicating whether or not an item was actually deleted.  Parameters:

      - `keys`: _(required)_ an array of keys referencing the entry to delete.

    + `MultiKeyMap.prototype.entries()`: returns an ECMAScript [`Iterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) object that contains the key array and value pairs for each entry in the `MultiKeyMap` instance.

    + `MultiKeyMap.prototype.forEach(callback [, thisArg])`: executes the provided function once for each keys array and value entry in the `MultiKeyMap` instance.  Parameters:

      - `callback`: _(required)_ the function to call for each entry in the `MultiKeyMap` instance.  This function is called with the parameters:

        - `keys`: the array of keys used to reference the entry.

        - `value`: the value for the entry.

        - `map`: a reference to the `MultiKeyMap` instance.

      - `thisArg`: _(optional)_ value to use as `this` when executing `callback`.

    + `MultiKeyMap.prototype.get(keys)`: returns the value for the given array of keys.  If no entry is found `undefined` is returned.  Parameters:

      - `keys`: _(required)_ an array of keys referencing the entry to lookup.

    + `MultiKeyMap.prototype.has(keys)`: returns a `Boolean` indicating whether or not the `MultiKeyMap` instance contains an entry for the given array of keys.

      - `keys`: _(required)_ an array of keys referencing the entry to lookup.

    + `MultiKeyMap.prototype.keys()`: returns an ECMAScript `Iterator` object that contains the key arrays for each entry in the `MultiKeyMap` instance.

    + `MultiKeyMap.prototype.set(keys, value)`: sets a value for the given keys.  If there is already a value for the given `keys` it is overwritten with the new value.  Parameters:

      - `keys`: _(required)_ an array of keys to reference the value.

      - `value`: _(required)_ the value of the entry.

    + `MultiKeyMap.prototype.traverse()`: returns a [`Traversor`](#class-traversor) object used to walk through the `MultiKeyMap` instance's internal graph to locate a specific value.

    + `MultiKeyMap.prototype.values()`: returns an ECMAScript `Iterator` object that contains the values for each entry in the `MultiKeyMap` instance.

    + `MultiKeyMap.prototype[Symbol.iterator]()`: returns the same ECMAScript `Iterator` object as `MultiKeyMap.prototype.entries()`.

### Class: `Traversor`

An object used to traverse through a `MultiKeyMap` instance's internal graph structure one key component at a time.  This object functions similarly to an ECMAScript `Iterator`.  Advancing a `Traversor` is similar to a reducer function, in that all previously requested key values limit the next possible node the `Traversor` can visit.

Instances of `Traversor` are created by calling `MultiKeyMap.prototype.traverse()`

  * __Methods__

    + `Traversor.prototype.next(key)`: advances the `Traversor` instance to the next specified key.  A call to `next()` amounts to hash lookup, and is performed in _O(1)_ constant time.  Parameters:

      - `key`: the next key component to move to in the connected `MultiKeyMap`'s internal graph.

      The `next()` method returns an object with the following keys:

        - `done`: a `Boolean` value indicating whether or not there is a connected vertex with the given `key` name.  If this value is `true`, the `Traversor` has essentially hit a dead end, and cannot be advanced any further.

        - `value`: the value at the current vertex.  If no value exists at the current vertext, then this is set to `undefined`.  This key is omitted if `done` is `true`.

  * __Example__

  ```js
  const MultiKeyMap = require('multikeymap');

  const map = new MultiKeyMap();

  map.set(['a', 'b', 'c'], 'foo');
  map.set(['a', 'c'], 'bar');
  map.set(['a', 'b', 'c', 'd'], 'baz');

  const traverse = map.traverse();

  const b = traverse.next('b');
  console.log(b); // { done: false, value: undefined }

  const a = traverse.next('a');
  console.log(a); // { done: false, value: undefined }

  const c = traverse.next('c');
  console.log(c); // { done: false, value: 'foo' }

  const d = traverse.next('d');
  console.log(d); // { done: false, value: 'baz' }

  const e = traverse.next('e');
  console.log(e); // { done: true }
  ```

## Performance

The `MultiKeyMap` class is read-optimized.  All lookups are done in _O(n)_ linear time, where _n_ is the number of items in a keys array.

## Compatibility

This library is written using ECMAScript 2015 (version 6), and consequently may not be compatible with older browsers.  Specifically, this module utilizes `class`, `Map`, `Set`, and `Symbol`.  Refer to the [ECMAScript compatibility chart](https://kangax.github.io/compat-table/es6/) to see if the `multikeymap` module will work in your target browsers.
