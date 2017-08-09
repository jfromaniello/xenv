const xenv = require('./..');
const assert = require('chai').assert;

describe('xenv', function () {
  it('should throw if params is undefined', function() {
    assert.throws(() => xenv(undefined, process.env), /params is required/);
  });

  it('should throw if schema is undefined', function() {
    assert.throws(() => xenv({}, process.env), /schema is required/);
  });

  it('should not add a property if is not required and has no default', function() {
    const schema = {
      'TEST_FOO': {
        parse: (foo) => foo
      }
    };
    const output = xenv({ schema }, {});
    assert.notProperty(output, 'TEST_FOO');
  });

  it('should add a property if is not required, has no default but it is provided', function() {
    const schema = {
      'TEST_FOO': {
        parse: (foo) => foo
      }
    };
    const output = xenv({ schema }, { TEST_FOO: '123' });
    assert.equal(output.TEST_FOO, '123');
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

  it('should work when default is a func', function() {
    const schema = {
      'FOO': {
        default: env => `https://${env.BAR}`
      },
      'BAR': {
        default: 'foo.com'
      }
    };
    const output = xenv({schema}, {});
    assert.equal(output.FOO, 'https://foo.com');
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

  it('should parse the default value', function() {
    const schema = {
      'FOO': {
        default: JSON.stringify({ xyz: 123 }),
        parse: JSON.parse
      }
    };

    const input = {};

    const output = xenv({schema}, input);

    assert.equal(output.FOO.xyz, 123);
  });

  it('should run transformations', function() {
    const schema = {
      'FOO': {
        default:   [1, 2, 3],
        parse:     str => str.split(','),
        transform: arr => new Set(arr)
      }
    };

    const input = {};

    const output = xenv({schema}, input);

    assert.instanceOf(output.FOO, Set);
  });

  it('should properly handle parse errors', function() {
    const schema = {
      'FOO': {
        default: JSON.stringify({ xyz: 123 }),
        parse: () => { throw new Error('error parsing'); }
      }
    };

    const input = {};

    assert.throws(() => xenv({ schema }, input), /Error parsing FOO/);
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


  it('should fail if the predefined schema doesnt exists', function() {
    const schema = {
      'FOO': {
        type: 'doris',
        required: true,
      }
    };

    const input = { FOO: 100 };

    assert.throws(() => xenv({ schema }, input), /The predefined type for FOO "doris" does not exists/);
  });

});
