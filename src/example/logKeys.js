const fs = require('fs');
const walkJson = require('../walkJson');

const allStrings = [];
const logProperty = (valueType, key, value, parentType) => console.log(`${valueType}:   ${key}: ${value}  -  parent type: ${parentType}`);

const handlerMethods = {
  object: (key, _value, parentType, metaData) => {
    logProperty('OBJECT', key, 'N/A', parentType);
    return walkJson.concatPathMeta(key, metaData);
  },
  array: (key, _value, parentType, metaData) => {
    logProperty('ARRAY ', key, 'N/A', parentType);
    return walkJson.concatPathMeta(key, metaData);
  },
  string: (key, value, parentType, metaData) => {
    logProperty('STRING', key, value, parentType);
    const finalPath = walkJson.concatPathMeta(key, metaData);
    allStrings.push(`${finalPath}: ${value}`);
  },
  number: (key, value, parentType, metaData) => {
    logProperty('NUMBER', key, value, parentType);
  },
  boolean: (key, value, parentType, metaData) => {
    logProperty('BOOLEAN', key, value, parentType);
  },
  undefined: (key, value, parentType, metaData) => {
    logProperty('UNDEFINED', key, value, parentType);
  },
};

const fileContent = fs.readFileSync('src/example/example.json', 'utf8');
walkJson.string(fileContent, handlerMethods, '');

console.log('\n\n------ Complete ------');
console.log('allStrings:', allStrings);