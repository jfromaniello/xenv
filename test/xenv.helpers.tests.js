const assert = require('chai').assert;
const xenv = require('./..');
const url = require('url');

describe('xenv.helpers', function() {
  describe('xenv.int', function() {

    it('should return an int schema', function() {
      const schema = xenv.int({ default: 3000 });
      assert.strictEqual(schema['default'], 3000);
      assert.strictEqual(schema['parse'], parseInt);
      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.ok(schema['validate'](100));
    });

  });

  describe('xenv.float', function() {
    it('should return a float schema', function() {
      const schema = xenv.float({ default: 5.5 });
      assert.strictEqual(schema['default'], 5.5);
      assert.strictEqual(schema['parse'], parseFloat);
      assert.notOk(schema['validate']('tete'));
      assert.ok(schema['validate'](10.12));
      assert.ok(schema['validate'](100));
    });
  });

  describe('xenv.object', function() {
    it('should return an object schema', function() {
      const def = {};
      const schema = xenv.object({ default: def });
      assert.strictEqual(schema['default'], def);
      assert.strictEqual(schema['parse'], JSON.parse);
      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.ok(schema['validate']({}));
    });
  });

  describe('xenv.url', function() {
    it('should return an url schema', function() {
      const def = {};
      const schema = xenv.url({ default: def });
      assert.strictEqual(schema['default'], def);
      assert.strictEqual(schema['parse'], url.parse);
      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.ok(schema['validate'](url.parse('http://google.com')));
    });
  });

  describe('xenv.boolean', function() {
    it('should return a boolean schema', function() {
      const schema = xenv.boolean({ default: true });
      assert.strictEqual(schema['default'], true);

      assert.notOk(schema['parse'](''));
      assert.notOk(schema['parse']());
      assert.notOk(schema['parse'](null));
      assert.notOk(schema['parse'](false));

      assert.ok(schema['parse']('1'));
      assert.ok(schema['parse']('tokads'));
      assert.ok(schema['parse'](' '));
      assert.ok(schema['parse'](true));

      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.ok(schema['validate'](true));
      assert.ok(schema['validate'](false));
    });
  });

});
