
# JSON Tree Walker

This small library recursively steps through a JSON tree, allowing you to perform actions at each step.

This library is useful for handling data within a JSON object when you don't know it's exact shape or depth.
This library uses syntax very similar to [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). You can supply and modify metadata at each level, almost exactly how you would with the `Array.reduce()` method's `initialValue` and `previousValue`.

Installation:
```javascript
// Using npm:
npm install json-tree-walker

// Using yarn:
yarn add json-tree-walker

// Import the method:
import walkJson from 'json-tree-walker';
```

`walkJson` exposes 2 methods: `string` and `json`. They are each quick ways to handle JSON in their appropriate formats.

Think of these methods like a classic [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method, but recursively for objects and it's nested children.


## API Reference

### Methods

```javascript
walkJson.json(json, typeMethods, initialMetaData)
walkJson.string(jsonString, typeMethods, initialMetaData)
```

| Parameter  | Type  | Description  |
| :--------- | :---- | :----------- |
| First parameters respectively: `json` \| `jsonString` | `object` \| `string` | **Required**. <br/>`json`: must be a valid JSON object <br/>`jsonString`: must be JSON as a string. |
| `typeMethods` | `object` | **Required**. The typeMethods object. |
| `initialMetaData` | `any` | The initial value for the metadata. This isn't technically required, but it's best practice to at least set it to a blank of your expected data-type (eg: `''`, `0`, `{}`, `[]`). |


### `typeMethods` object

This is the heart of json-tree-walker. It's an object of callbacks functions, each key should represent the primitive Javascript type you'd like to handle:
`object`, `array`, `string`, `number`, `boolean`, and `undefined` (which handles nulls).

**Example**:
```javascript
const typeMethods = {
  object: (key, value, parentType, metaData) => { /* ... */ },
  array: (key, value, parentType, metaData) => { /* ... */ },
  string: (key, value, parentType, metaData) => { /* ... */ },
  number: (key, value, parentType, metaData) => { /* ... */ },
  boolean: (key, value, parentType, metaData) => { /* ... */ },
  undefined: (key, value, parentType, metaData) => { /* ... */ }
}
```

Each callback will receive 4 properties:

| Property  | Type  | Description  |
| :-------- | :---- | :----------- |
| `key` | `string` | This is the key name of the current value (or an index number if the parent is an array). |
| `value` | `any` | This is the value of this property. |
| `parentType` | `string` | This is a string of the parent's type. |
| `metaData` | `any` | This is the current chain's metadata so far. |

What you return in each of the callbacks will set the new metadata for any child properties that come next. (Again, very similar to `Array.reduce()`)

A couple of notes to remember:
- These callbacks are used recursively throughout the JSON object everytime that primitive is encountered.
- If the callback is being fired for the first properties of the root of the object, it's `metadata` will be the `initialMetadata`.


### Helper method

```javascript
walkJson.concatPathMeta(key, metaData)
```

| Parameter  | Type  | Description  |
| :--------- | :---- | :----------- |
| `key` | `string` \| `number` \| `undefined` | **Required**. This is the current item's `key` property. |
| `metaData` | `string` \| `undefined` | **Required**. The metaData string. |

This helper method is used for generating the string-path of the object. It is a helper for one of the most common uses of the metaData object.
It will concat the current key to the metaData as a string.
For example:
```
Walking down this nested object:
{"one": {"two": {"three": [{"five": true}]}}}

would return a string of:
['one']['two']['three'][0]['five']
```
**Note**: the output may appear unnecessarily verbose, but this allows you to use it directly within other javascript calls without needing to finesse the string. If you're working with a function that can receive an object's path as a string (eg: [Lodash's `_.get` method](https://lodash.com/docs/#get)), then this output will work as expected.

The example below showcases this method being utilized.


## WalkJson Usage/Example

```javascript
import walkJson from 'json-tree-walker';

const exampleObj = {
  "first_string": "foo",
  "first_number": 1234,
  "nested_object": {
    "second_string": "bar",
    "array_of_strings": [ "hello", "world" ],
    "second_nested_object": {
      "yes": "correct",
      "no": "incorrect"
    }
  }
}

const nestedStrings = [];
const typeMethods = {
  object: (key, _value, _parentType, metaData) => walkJson.concatPathMeta(key, metaData),
  array: (key, _value, _parentType, metaData) => walkJson.concatPathMeta(key, metaData),
  string: (key, value, _parentType, metaData) => {
    const finalPath = walkJson.concatPathMeta(key, metaData);
    nestedStrings.push(`${finalPath}: ${value}`);
  }
};

walkJson.json(exampleObj, typeMethods, '');

console.log(nestedStrings);
// Result:
// [
//   "['first_string']: foo",
//   "['nested_object']['second_string']: bar",
//   "['nested_object']['array_of_strings'][0]: hello",
//   "['nested_object']['array_of_strings'][1]: world",
//   "['nested_object']['second_nested_object']['yes']: correct",
//   "['nested_object']['second_nested_object']['no']: incorrect"
// ]
```

You can view a more fully-encompassed example from the [repo example](https://github.com/JDudzik/json-tree-walker/blob/main/src/example/logKeys.js).