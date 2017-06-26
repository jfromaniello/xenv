module.exports = function(params, envs) {
  if (typeof params !== 'object') {
    throw new Error('params is required');
  }

  if (typeof params.schema !== 'object') {
    throw new Error('schema is required');
  }

  const result = {};

  Object.keys(params.schema)
        .forEach(property => {
          const config = params.schema[property];

          if (!config.required && typeof config.default === 'undefined') {
            throw new Error(`${property} must either have a default or be required`);
          }

          if (config.required && !(property in envs)) {
            throw new Error(`The required environment variable ${property} has not been defined`);
          }

          if (property in envs) {
            if (config.parse && typeof envs[property] === 'string') {
              result[property] = config.parse(envs[property]);
            } else {
              result[property] = envs[property];
            }
          } else {
            result[property] = config.default;
          }

        });

  return result;
};
