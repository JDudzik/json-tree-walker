const walkJson = require('../walkJson');

const filePath = 'src/example/example.json';
const allStrings = [];
const buildObjectPathString = (metaData, key) => key ? `${metaData}.${key}` : metaData;
const logProperty = (valueType, key, value, parentType) => console.log(`${valueType}:   ${key}: ${value}  -  parent type: ${parentType}`);

const handlerMethods = {
  object: (key, _value, parentType, metaData) => {
    logProperty('OBJECT', key, 'N/A', parentType);
    return buildObjectPathString(metaData, key);
  },
  array: (key, _value, parentType, metaData) => {
    logProperty('ARRAY ', key, 'N/A', parentType);
    return buildObjectPathString(metaData, key);
  },
  string: (key, value, parentType, metaData) => {
    logProperty('STRING', key, value, parentType);
    allStrings.push(`${metaData}.${key}: ${value}`);
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

walkJson.file(filePath, handlerMethods, 'ROOT');
console.log('\n\n------ Complete ------');
console.log('allStrings:', allStrings);