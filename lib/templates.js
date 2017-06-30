const _   = require('lodash');
const url = require('url');
const ms  = require('ms');

module.exports.int = function(params) {
  const schema = _.extend({
    parse:    parseInt,
    validate: n => n === parseInt(n, 10)
  }, params || {});
  return schema;
};

module.exports.float = function(params) {
  const schema = _.extend({
    parse:    parseFloat,
    validate: n => n === parseFloat(n, 10)
  }, params || {});
  return schema;
};

module.exports.object = function(params) {
  const schema = _.extend({
    parse:    JSON.parse,
    validate: v => typeof v === 'object'
  }, params || {});
  return schema;
};

module.exports.boolean = function(params) {
  const schema = _.extend({
    parse:    v => Boolean(v),
    validate: v => typeof v === 'boolean'
  }, params || {});
  return schema;
};


module.exports.string = function(params) {
  const schema = _.extend({
    validate: v => typeof v === 'string'
  }, params || {});

  if (params.oneOf) {
    const validation = schema.validate || () => true;
    const set = new Set(params.oneOf);
    schema.validate = v => validation(v) && set.has(v);
  }

  return schema;
};

module.exports.arrayOfStrings = function(params) {
  const schema = _.extend({
    validate: v => Array.isArray(v),
    parse: v => {
      if (v === '') {
        return [];
      }
      return v.split(',');
    }
  }, params || {});

  return schema;
};

module.exports.url = function(params) {
  const schema = _.extend({
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

module.exports.millis = function(params) {
  const schema = _.extend({
    parse:    v => ms(v),
    validate: n => n === parseInt(n, 10)
  }, params || {});

  return schema;
};
