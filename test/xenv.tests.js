const xenv = require('./..');
const assert = require('chai').assert;

describe('xenv', function () {
  it('should throw if params is undefined', function() {
    assert.throws(() => xenv(undefined, process.env), /params is required/);
  });

  it('should throw if schema is undefined', function() {
    assert.throws(() => xenv({}, process.env), /schema is required/);
  });

  it('should fail if property is not required and has no default', function() {
    const schema = {
      'TEST_FOO': {
        parse: (foo) => foo
      }
    };

    assert.throws(() => xenv({ schema }, process.env), /TEST_FOO must either have a default or be required/);
  });

  it('should return an object with the default values for the missing properties', function() {
    const schema = {
      'FOO': {
        default: 'test'
      }
    };

    const output = xenv({schema}, {});

    assert.equal(output.FOO, 'test');
  });

  it('should throw an error for required properties', function() {
    const schema = {
      'FOO': {
        required: true
      }
    };

    assert.throws(() => xenv({ schema }, process.env), /The required environment variable FOO has not been defined/);
  });


  it('should not throw an error when required returns false and the variable is missing', function() {
    const schema = {
      'BAR': {
        default: false
      },
      'FOO': {
        required: env => env['BAR']
      }
    };

    assert.doesNotThrow(() => xenv({ schema }, process.env));
  });

  it('should throw an error when required returns true and the variable is missing', function() {
    const schema = {
      'BAR': {
        default: false
      },
      'FOO': {
        required: env => env['BAR']
      }
    };

    assert.doesNotThrow(() => xenv({ schema }, process.env));
  });

  it('should execute the parse function when the variable is an string', function() {
    const schema = {
      'FOO': {
        required: true,
        parse: JSON.parse
      }
    };

    const input = { FOO: JSON.stringify({ xyz:123 }) };

    const output = xenv({schema}, input);

    assert.equal(output.FOO.xyz, 123);
  });

  it('should not parse non-string variables', function() {
    const schema = {
      'FOO': {
        required: true,
        parse: JSON.parse
      }
    };

    const input = { FOO: { xyz: 123} };

    const output = xenv({ schema }, input);

    assert.equal(output.FOO.xyz, 123);
  });


  it('should throw an error when validate returns false', function() {
    const schema = {
      'FOO': {
        required: true,
        validate: foo => foo > 1000
      }
    };

    const input = { FOO: 100 };

    assert.throws(() => xenv({ schema }, input), /The environment variable FOO has been defined with an invalid value/);
  });


  it('should work with predefined schemas', function() {
    const schema = {
      'FOO': {
        type: 'url',
        required: true,
      }
    };

    const input = { FOO: 100 };

    assert.throws(() => xenv({ schema }, input), /The environment variable FOO has been defined with an invalid value/);
  });

});
