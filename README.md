# toobs [![Build Status](https://secure.travis-ci.org/ben-bradley/toobs.png)](http://travis-ci.org/ben-bradley/toobs) [![NPM](https://nodei.co/npm/toobs.png?downloads=true)](https://nodei.co/npm/toobs/)

A network speed testing tool for NodeJS.

*Still in development, use at your own peril*

## Install

`npm install toobs`

## Usage

#### Server Side
```javascript
var toobs = require('toobs');

var server = new toobs.Server();

server.on('connection', function(socket) {
  console.log('connected');

  socket.on('test:sample', function(sample) {
    console.log(sample);
  });

  socket.on('test:start', function() {
    console.log('test started');
  });

  socket.on('test:done', function(summary) {
    console.log('test done');
    console.log(summary);
  });

});
```

#### Client Side
```javascript
var toobs = require('toobs');

var client = new toobs.Client({ host: '192.168.1.14' });

client.on('test:sample', function(sample) {
  console.log(sample);
});

client.on('test:start', function() {
  console.log('test started');
});

client.on('test:done', function(summary) {
  console.log('test done');
  console.log(summary);
});

client.test({
  rate: '100MB',
  time: 10
});
```

## `bits` vs. `Bytes`

`Socket`s record values in Bytes so I convert them to bits by multiplying by 8.  Also, below is a table showing the conversions performed to translate human-readable sizes to `Buffer()` values:
```javascript
var BYTES = {
  b: 0.125,
  bit: 0.125,

  kb: 128,
  kbit: 128,
  kilobit: 128,

  mb: 131072,
  mbit: 131072,
  megabit: 131072,

  gb: 134217728,
  gbit: 134217728,
  gigabit: 134217728,

  B: 1,
  Byte: 1,

  KB: 1024,
  KByte: 1024,
  KiloByte: 1024,

  MB: 1048576,
  MByte: 1048576,
  MegaByte: 1048576

  // sorry, NodeJS can't handle GB buffer sizes
}
```

## Toobs Tests

Toobs tests work by sending `new Buffer()` data down a TCP socket.  Node will dump the buffer straight to the kernel buffer so those rates are subject to interpretation.

**Limitation** - The highest `size` or `rate` value is `1023MB`, Node can't support buffer sizes higher than that.

`Client.test(options)` The `options` object can have the following properties:

- send `rate`/sec for `time` seconds
```javascript
{
  rate: '1gb', // string format: "{num}(b|kb|mb|gb|B|KB|MB)", max is "1023MB"
  time: 10     // number of seconds to run the test
}
```

- send `size` as fast as possible
```javascript
{
  size: '500mb' // send a 500mbit buffer, same format as .rate
}
```

## Events

- Client
  - [Class `net.Socket` events](http://nodejs.org/api/net.html#net_class_net_socket)
  - `test:sample` - Returns an object containing the details of the most recent sample of traffic
  - `test:start` - Emitted when a test is started
  - `test:done` - Emitted when a socket is closed
- Server
  - [Class `net.Server` events](http://nodejs.org/api/net.html#net_class_net_server)

## ToDo

- Add more test types (ramp, etc?)
- bump for Travis-CI
