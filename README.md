
# JSON Tree Walker

This small library recursively steps through a JSON tree, allowing you to perform actions at each step.

This library is useful for handling data within a JSON object when you don't know it's exact shape or depth.
This library uses syntax very similar to [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). You can supply and modify metadata at each level, almost exactly how you would with the `Array.prototype.reduce()` method's `initialValue` and `previousValue`.

Installation:
```javascript
// Using npm:
npm install json-tree-walker

// Using yarn:
yarn add json-tree-walker

// Import the method:
import walkJson from 'json-tree-walker';
```

`walkJson` exposes 3 methods: `string`, `json`, and `file`. They are each quick ways to handle JSON in their appropriate formats.

Think of these methods like a classic [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method, but recursively for objects and it's nested children.


## API Reference

### Methods

```javascript
walkJson.json(json, typeMethods, initialMetaData)
walkJson.string(jsonString, typeMethods, initialMetaData)
walkJson.file(filePath, typeMethods, initialMetaData)
```

| Parameter  | Type  | Description  |
| :--------- | :---- | :----------- |
| First parameters respectively: `json` \| `jsonString` \| `filePath` | `object` \| `string` \| `string` | **Required**. <br/>`json`: must be a valid JSON object <br/>`jsonString`: must be JSON as a string. <br/>`filePath`: A valid file-path to a `.json` file. (**note**: This will read the file using the Node `fs.readFileSync()` method. |
| `typeMethods` | `object` | **Required**. The typeMethods object |
| `initialMetaData` | `any` | The initial value for the metadata |


### typeMethods object

This is the heart of json-tree-walker. It's an object of callbacks, each key should represent the primitive Javascript type you'd like to handle:
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
| `key` | `string` | This is the key name of the current value (or an index number if the parent is an array) |
| `value` | `any` | This is the value of this property |
| `parentType` | `string` | This is a string of the parent's type |
| `metaData` | `any` | This is the current chain's metadata so far |

Whatever is returned in each of the callbacks will set the new metadata for any child properties that come next.

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
| `metaData` | `string` \| `undefined` | **Required**. The metaData string |
This helper method is used for generating the string-path of the object. It is a helper for one of the most common uses of the metaData object.
It will concat the current key to the metaData as a string.
For example:
```
Walking down this nested object:
{"one": {"two": {"three": [{"five": true}]}}}

would return a string of:
["one"]["two"]["three"][0]["five"]
```
The example below showcases this method being utilized.



## WalkJson Usage/Example
You can view a fully-encompassed example from the [repo example](https://github.com/JDudzik/json-tree-walker/blob/main/src/example/logKeys.js).


```javascript
import walkJson from 'json-tree-walker';

const exampleObj = {
  "my_string": "foo",
  "my_number": 1234,
  "nested_object": {
    "another_string": "bar",
    "array_of_strings": [ "hello", "world" ],
    "second_nested_object": {
      "yes": "yup",
      "no": "nope"
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
//   "example['my_string']: foo",
//   "example['nested_object']['another_string']: bar",
//   "example['nested_object']['array_of_strings'][0]: hello",
//   "example['nested_object']['array_of_strings'][1]: world",
//   "example['nested_object']['second_nested_object']['yes']: yup",
//   "example['nested_object']['second_nested_object']['no']: nope"
// ]
```
