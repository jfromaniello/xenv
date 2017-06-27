const _ = require('lodash');
const url = require('url');

module.exports.int = function(params) {
  const schema = _.extend({
    default:  0,
    parse:    parseInt,
    validate: n => n === parseInt(n, 10)
  }, params || {});
  if (params && params.required) {
    delete schema.default;
  }
  return schema;
};

module.exports.float = function(params) {
  const schema = _.extend({
    default:  0,
    parse:    parseFloat,
    validate: n => n === parseFloat(n, 10)
  }, params || {});
  if (params && params.required) {
    delete schema.default;
  }
  return schema;
};

module.exports.object = function(params) {
  const schema = _.extend({
    default:  0,
    parse:    JSON.parse,
    validate: v => typeof v === 'object'
  }, params || {});
  if (params && params.required) {
    delete schema.default;
  }
  return schema;
};

module.exports.boolean = function(params) {
  const schema = _.extend({
    default:  false,
    parse:    v => Boolean(v),
    validate: v => typeof v === 'boolean'
  }, params || {});
  if (params && params.required) {
    delete schema.default;
  }
  return schema;
};


module.exports.string = function(params) {
  const schema = _.extend({
    default:  '',
    validate: v => typeof v === 'string'
  }, params || {});

  if (params && params.required) {
    delete schema.default;
  }

  if (params.oneOf) {
    const validation = schema.validate || () => true;
    const set = new Set(params.oneOf);
    schema.validate = v => validation(v) && set.has(v);
  }

  return schema;
};

module.exports.arrayOfStrings = function(params) {
  const schema = _.extend({
    default:  [],
    validate: v => Array.isArray(v),
    parse: v => {
      if (v === '') {
        return [];
      }
      return v.split(',');
    }
  }, params || {});

  if (params && params.required) {
    delete schema.default;
  }

  return schema;
};

module.exports.url = function(params) {
  const schema = _.extend({
    default:  0,
    parse:    url.parse,
    validate: v => {
      return typeof v === 'object' &&
            ('hostname' in v || 'host' in v) &&
            'port' in v;
    }
  }, params || {});
  if (params && params.required) {
    delete schema.default;
  }
  return schema;
};
