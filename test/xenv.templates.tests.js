const assert = require('chai').assert;
const url = require('url');
const xenvTemplates = require('../lib/templates');

describe('xenvTemplates.templates', function() {
  describe('xenvTemplates.int', function() {

    it('should return an int schema', function() {
      const schema = xenvTemplates.int({ default: 3000 });
      assert.strictEqual(schema['default'], 3000);
      assert.strictEqual(schema['parse'], parseInt);
      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.ok(schema['validate'](100));
    });

  });

  describe('xenvTemplates.float', function() {
    it('should return a float schema', function() {
      const schema = xenvTemplates.float({ default: 5.5 });
      assert.strictEqual(schema['default'], 5.5);
      assert.strictEqual(schema['parse'], parseFloat);
      assert.notOk(schema['validate']('tete'));
      assert.ok(schema['validate'](10.12));
      assert.ok(schema['validate'](100));
    });
  });

  describe('xenvTemplates.object', function() {
    it('should return an object schema', function() {
      const def = {};
      const schema = xenvTemplates.object({ default: def });
      assert.strictEqual(schema['default'], def);
      assert.strictEqual(schema['parse'], JSON.parse);
      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.ok(schema['validate']({}));
    });
  });

  describe('xenvTemplates.url', function() {
    it('should return an url schema', function() {
      const def = {};
      const schema = xenvTemplates.url({ default: def });
      assert.strictEqual(schema['default'], def);
      assert.strictEqual(schema['parse'], url.parse);
      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.ok(schema['validate'](url.parse('http://google.com')));
    });
  });

  describe('xenvTemplates.string', function() {
    it('should return an string schema', function() {
      const schema = xenvTemplates.string({ default: 'jj' });
      assert.strictEqual(schema['default'], 'jj');
      assert.strictEqual(schema['parse'], undefined);
      assert.ok(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.notOk(schema['validate'](false));
    });

    it('should allow valid values', function() {
      const schema = xenvTemplates.string({ default: 'jj', oneOf: [ 'x', 'y' ] });
      assert.ok(schema['validate']('x'));
      assert.ok(schema['validate']('y'));
      assert.notOk(schema['validate']('z'));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.notOk(schema['validate'](false));
    });
  });

  describe('xenvTemplates.boolean', function() {
    it('should return a boolean schema', function() {
      const schema = xenvTemplates.boolean({ default: true });
      assert.strictEqual(schema['default'], true);

      assert.notOk(schema['parse'](''));
      assert.notOk(schema['parse']());
      assert.notOk(schema['parse'](null));
      assert.notOk(schema['parse'](false));
      assert.notOk(schema['parse']('false'));

      assert.ok(schema['parse']('1'));
      assert.ok(schema['parse']('tokads'));
      assert.ok(schema['parse'](' '));
      assert.ok(schema['parse'](true));
      assert.ok(schema['parse']('true'));

      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.ok(schema['validate'](true));
      assert.ok(schema['validate'](false));
    });
  });

  describe('xenvTemplates.arrayOfStrings', function() {
    it('should return a arrayOfStrings schema', function() {
      const schema = xenvTemplates.arrayOfStrings({default: []});
      assert.ok(Array.isArray(schema['default']));
      assert.equal(schema['default'].length, 0);

      assert.equal(schema['parse']('').length, 0);
      assert.deepEqual(schema['parse']('j,j'), ['j', 'j']);

      assert.notOk(schema['validate']('tete'));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.ok(schema['validate']([]));
    });
  });



  describe('xenvTemplates.millis', function() {
    it('should return an millis schema', function() {
      const schema = xenvTemplates.millis({ default: 100 });
      assert.strictEqual(schema['default'], 100);

      assert.strictEqual(schema['parse']('1m'), 1000 * 60);
      assert.strictEqual(schema['parse']('1h'), 1000 * 60 * 60);

      assert.ok(schema['validate'](100));
      assert.notOk(schema['validate'](10.12));
      assert.notOk(schema['validate']({}));
      assert.notOk(schema['validate'](false));
    });
  });

  describe('xenvTemplates.seconds', function() {
    it('should be able to parse', function() {
      const schema = xenvTemplates.seconds({ });

      assert.strictEqual(schema['parse']('10'), 10);
      assert.strictEqual(schema['parse'](10), 10);
      assert.strictEqual(schema['parse']('10h'), 36000);
    });
  });
});
