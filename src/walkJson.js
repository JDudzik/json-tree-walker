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
  json: (json, handlerMethods, initialMetaData) => {
    if (typeof json !== 'object') {
      throw new Error('"json" must be an object');
    }
    walkBranch(undefined, json, undefined, handlerMethods, initialMetaData);
  },
  string: (jsonString, handlerMethods, initialMetaData) => {
    if (typeof jsonString !== 'string') {
      throw new Error('"jsonString" must be a string');
    }
    const json = JSON.parse(jsonString);
    walkBranch(undefined, json, undefined, handlerMethods, initialMetaData);
  },
  concatPathMeta: (key, metaData) => {
    if (
      typeof metaData !== 'string' &&
      typeof metaData !== 'undefined'
    ) {
      throw new Error('"metaData" must a string or undefined');
    }
    
    let keyPathPart = '';
    if (typeof key === 'string') { keyPathPart = `['${key}']`; }
    if (typeof key === 'number') { keyPathPart = `[${key}]`; }
    return (metaData ? (`${metaData}${keyPathPart}`) : keyPathPart);
  },
};
