const xtend = require('xtend');
const url = require('url');

module.exports = function(params, envs) {
  if (typeof params !== 'object') {
    throw new Error('params is required');
  }

  if (typeof params.schema !== 'object') {
    throw new Error('schema is required');
  }

  const result = {};

  const keys = Object.keys(params.schema);

  //generate the result object
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

  //validate required properties
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

  //validate schemas
  keys.forEach(property => {
    const config = params.schema[property];

    if (typeof config.validate !== 'function' ||
        typeof result[property] === 'undefined') {
      return;
    }

    if (!config.validate(result[property])) {
      throw new Error(`The environment variable ${property} has been defined with an invalid value`);
    }
  });

  return result;
};

module.exports.int = function(params) {
  return xtend({
    default:  0,
    parse:    parseInt,
    validate: n => n === parseInt(n, 10)
  }, params || {});
};

module.exports.float = function(params) {
  return xtend({
    default:  0,
    parse:    parseFloat,
    validate: n => n === parseFloat(n, 10)
  }, params || {});
};

module.exports.object = function(params) {
  return xtend({
    default:  0,
    parse:    JSON.parse,
    validate: v => typeof v === 'object'
  }, params || {});
};

module.exports.boolean = function(params) {
  return xtend({
    default:  false,
    parse:    v => Boolean(v),
    validate: v => typeof v === 'boolean'
  }, params || {});
};

module.exports.url = function(params) {
  return xtend({
    default:  0,
    parse:    url.parse,
    validate: v => {
      return typeof v === 'object' &&
            ('hostname' in v || 'host' in v) &&
            'port' in v;
    }
  }, params || {});
};
