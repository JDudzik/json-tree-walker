const fs = require('fs');

const selectMethod = (json) => {
  const jsonType = typeof json;
  if (Array.isArray(json)) {
    return 'array';
  }
  if (json !== null) {
    return jsonType;
  }

  return 'undefined';
};

const walkerMethods = {
  object: (object, handlerMethods, newMetaData) => {
    const keys = Object.keys(object);
    keys.forEach((key) => {
      walkBranch(key, object[key], 'object', handlerMethods, newMetaData);
    });
  },
  array: (array, handlerMethods, newMetaData) => {
    array.forEach((value, index) => walkBranch(index, value, 'array', handlerMethods, newMetaData));
  },
};

function walkBranch(key, value, parentType, handlerMethods, metaData) {
  const selectedMethod = selectMethod(value);
  let newMetaData = undefined;
  if (selectedMethod && handlerMethods[selectedMethod]) {
    newMetaData = handlerMethods[selectedMethod](key, value, parentType, metaData, handlerMethods);
  }
  if (selectedMethod && walkerMethods[selectedMethod]) {
    walkerMethods[selectedMethod](value, handlerMethods, newMetaData);
  }
}

module.exports = {
  string: (jsonString, handlerMethods, initialMetaData) => {
    const json = JSON.parse(jsonString);
    walkBranch(undefined, json, 'N/A', handlerMethods, initialMetaData);
  },
  json: (data, handlerMethods, initialMetaData) => {
    walkBranch(undefined, data, 'N/A', handlerMethods, initialMetaData);
  },
  file: (filePath, handlerMethods, initialMetaData) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(fileContent);
    walkBranch(undefined, json, 'N/A', handlerMethods, initialMetaData);
  },
};
