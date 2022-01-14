
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

`walkJson` exposes 3 helper methods: `string`, `json`, and `file`. They are each quick ways to handle JSON in their appropriate formats.

Think of these methods like a classic [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method, but recursively for objects and it's nested children.


## API Reference

#### json

```javascript
  walkJson.json(json, typeMethods, initialMetaData)
```

| Parameter  | Type  | Description  |
| :--------- | :---- | :----------- |
| `json` | `object` | **Required**. JSON object |
| `typeMethods` | `object` | **Required**. The typeMethods object |
| `initialMetaData` | `any` | The initial value for the metadata |

This method walks through the properties and nested values of a JSON object.
(More on `typeMethods` below).



#### String

```javascript
  walkJson.string(jsonString, typeMethods, initialMetaData)
```

| Parameter  | Type  | Description  |
| :--------- | :---- | :----------- |
| `jsonString` | `string` | **Required**. JSON string |
| `typeMethods` | `object` | **Required**. The typeMethods object |
| `initialMetaData` | `any` | The initial value for the metadata |

This method is identical to `walkJson.json()` except it parses a string for JSON before continuing.
(More info on `typeMethods` below)


#### file

```javascript
  walkJson.file(filePath, typeMethods, initialMetaData)
```

| Parameter  | Type  | Description  |
| :--------- | :---- | :----------- |
| `filePath` | `string` | **Required**. File path to the .json file |
| `typeMethods` | `object` | **Required**. The typeMethods object |
| `initialMetaData` | `any` | The initial value for the metadata |

This method is identical to `walkJson.json()` except it loads a JSON file and walks through the contents.
(More info on `typeMethods` below).


## typeMethods

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
| :--------- | :---- | :----------- |
| `key` | `string` | This is the key name of the current value |
| `value` | `any` | This is the value of this property |
| `parentType` | `string` | This is a string of the parent's type |
| `metaData` | `any` | This is the current chain's metadata so far |

Whatever is returned in each of the callbacks will set the new metadata for any child properties that come next.

A couple of notes to remember:
- These callbacks are used recursively throughout the JSON object everytime that primitive is encountered.
- If the callback is being fired for the first properties of the root of the object, it's `metadata` will be the `initialMetadata`.
## Usage/Example
You can view a fully-encompassed example from the [repo example](https://github.com/JDudzik/json-tree-walker/blob/main/src/example/logKeys.js).

```javascript
// example.json

{
  "my_string": "foo",
  "my_number": 1234,
  "nested_object": {
    "another_string": "bar",
    "second_nested_object": {
      "yes": "yup",
      "no": "nope"
    }
  }
}
```

```javascript
import walkJson from 'json-tree-walker';

const concatMetaData = (metaData, key) => key ? `${metaData}.${key}` : metaData;

const nestedStrings = [];
const typeMethods = {
  object: (key, _value, parentType, metaData) => {
    return concatMetaData(metaData, key);
  },
  array: (key, _value, parentType, metaData) => {
    return concatMetaData(metaData, key);
  },
  string: (key, value, parentType, metaData) => {
    nestedStrings.push(`${metaData}.${key}: ${value}`);
  }
};

walkJson.file('./example.json', typeMethods, 'ROOT');

console.log(nestedStrings);

// Result:
// [
//   'ROOT.my_string: foo',
//   'ROOT.nested_object.another_string: bar',
//   'ROOT.nested_object.second_nested_object.yes: yup',
//   'ROOT.nested_object.second_nested_object.no: nope'
// ]
```
