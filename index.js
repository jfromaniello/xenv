const templates = require('./lib/templates');
const _ = require('lodash');

module.exports = function(params, envs) {
  if (typeof params !== 'object') {
    throw new Error('params is required');
  }

  if (typeof params.schema !== 'object') {
    throw new Error('schema is required');
  }

  const result = {};

  const schema = _.clone(params.schema);
  const keys = Object.keys(schema);

  keys.forEach(property => {
    const type = schema[property].type;
    if (typeof type === 'undefined') { return; }

    const template = templates[type];
    if (typeof template !== 'function') {
      throw new Error(`The predefined type for FOO "${type}" does not exists`);
    }
    schema[property] = template(schema[property]);
  });

  //copy properties from input and set defaults
  keys.forEach(property => {
    const config = schema[property];
    if (_.has(envs, property)) {
      result[property] = envs[property];
    } else if (_.has(config, 'default') && typeof config.default !== 'function') {
      result[property] = config.default;
    }
  });

  //execute defaults functions
  keys.filter(property => {
    return !_.has(envs, property) &&
           typeof schema[property].default === 'function';
  }).forEach(property => {
    const config = schema[property];
    result[property] = config.default(result);
  });

  //execute parsers
  keys.filter(property => {
    return typeof result[property] === 'string' &&
      typeof schema[property].parse === 'function';
  }).forEach(property => {
    try {
      result[property] = schema[property].parse(result[property]);
    } catch(err) {
      throw new Error(`Error parsing ${property}: ${err.message}`);
    }
  });

  //validate required properties
  keys.forEach(property => {
    const config = schema[property];

    if (!config.required || _.has(result, property)) {
      return;
    }

    if (config.required === true) {
      throw new Error(`The required environment variable ${property} has not been defined`);
    }

    if (typeof config.required === 'function' && config.required(result)) {
      throw new Error(`The required environment variable ${property} has not been defined`);
    }
  });

  //validate schemas
  keys.forEach(property => {
    const config = schema[property];

    if (typeof config.validate !== 'function' ||
        !_.has(result, property)) {
      return;
    }

    if (!config.validate(result[property])) {
      throw new Error(`The environment variable ${property} has been defined with an invalid value`);
    }
  });

  return result;
};
