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
    parse: parseInt
  },
  BLACKLIST: {
    default: [],
    parse: blacklist => blacklist.split(',')
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
  BLACKLIST=foo,bar \
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
  BLACKLIST: ['foo', 'bar']
}
```

Running throws an exception:

```javascript
node test.js

The required environment variable MONGODB has not been defined.
```
