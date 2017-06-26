module.exports = function(params, envs) {
  if (typeof params !== 'object') {
    throw new Error('params is required');
  }

  if (typeof params.schema !== 'object') {
    throw new Error('schema is required');
  }

  const result = {};

  const keys = Object.keys(params.schema);

  keys.forEach(property => {
    const config = params.schema[property];

    if (!config.required && typeof config.default === 'undefined') {
      throw new Error(`${property} must either have a default or be required`);
    }

    if (property in envs) {
      if (config.parse && typeof envs[property] === 'string') {
        result[property] = config.parse(envs[property]);
      } else {
        result[property] = envs[property];
      }
    } else if ('default' in config) {
      result[property] = config.default;
    }
  });

  keys.forEach(property => {
    const config = params.schema[property];

    if (typeof config.required === 'undefined' || property in result) {
      return;
    }

    if (config.required === true) {
      throw new Error(`The required environment variable ${property} has not been defined`);
    }

    if (typeof config.required === 'function' && config.required(result)) {
      throw new Error(`The required environment variable ${property} has not been defined`);
    }
  });

  return result;
};
