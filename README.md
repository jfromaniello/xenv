This module allows you to parse and validate configuration variables.


## Define an schema


```javascript
const url = require('url');
const xenv = require('xenv');

const schema = {
  MONGODB: {
    required: true
  },
  RABBITMQ: {
    required: true,
    parse: url.parse
  },
  PORT: {
    default: 9000,
    parse: parseInt,
    validate: port => port > 1000
  },
  BLOCKED: {
    default: [],
    parse: blocked => blocked.split(',')
  }
};

const env = xenv({ schema }, process.env);

console.dir(env);
```

Then running:

```
MONGODB=mongodb://localhost/test \
  RABBITMQ=amqp://user:pass@localhost/test \
  PORT=9000 \
  BLOCKED=foo,bar \
  node test.js
```

Will print:

```javascript
{
  MONGODB: 'mongodb://localhost/test',
  RABBITMQ: {
    protocol: 'amqp:',
    auth: 'user:pass',
    host: 'localhost',
    hostname: 'localhost',
    path: '/test'
  },
  PORT: 9000,
  BLOCKED: ['foo', 'bar']
}
```

Running throws an exception:

```javascript
node test.js

The required environment variable MONGODB has not been defined.
```

## Common techniques

xenv is an attempt to create an human readable DSL for configuration. Given than some patterns often repeat I have included some templates.

Example:

```javascript
PORT: {
  parse: parseInt,
  default: 9000
},
BLOCKED: {
  default: [],
  parse: blocked => blocked.split(','),
  validate: v => Array.isArray(v)
},
LOG_LEVEL: {
  default: 'debug',
  validate: level => ['error', 'info', 'debug'].indexOf(level) > -1
}
```

Can be written as follows:

```javascript
PORT: {
  type: 'int'
  default: 9000
},
BLOCKED: {
  type: 'arrayOfStrings'
},
LOG_LEVEL: {
  type: 'string',
  default: 'debug',
  oneOf: ['error', 'info', 'debug']
}
```

## To parse or not to parse

xenv will attempt to parse the value of a variable only if the value is an string. The idea is that you can combine environment variables with other source of configurations.

Example:


```javascript
const fs = require('fs');
const configFromFile = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE, 'utf8'));
const rawConfig = _.extend({}, configFromFile, process.env);
const config = xenv(schema, rawConfig);
```

In this case is possible that the configuration sourced from the JSON file is already parsed while settings coming from environment variables have some type of encoding.

Imagine you have a `BLOCKED` variable like the one shown before (`type: 'arrayOfStrings'`). If xenv receives an string it will do `value.split(',')` but if the variable is an array then it will not try to parse it.

## License

MIT 2017 - José F. Romaniello






