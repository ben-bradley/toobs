# toobs [![Build Status](https://secure.travis-ci.org/ben-bradley/toobs.png)](http://travis-ci.org/ben-bradley/toobs) [![NPM](https://nodei.co/npm/toobs.png?downloads=true)](https://nodei.co/npm/toobs/)

A network speed testing tool for NodeJS.
*Still in development, don't use this yet!*

## Install

`npm install ben-bradley/toobs`

## Test

Coming ~~soon~~ eventually...
`cd node_modules/ping-lite && mocha`

## Usage

#### Server Side
```javascript
var toobs = require('../toobs');

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
var toobs = require('../toobs');

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

## Toobs Tests

`Client.test(options)` The `options` object can have the following properties:
```javascript
{ // send .rate/sec for .time seconds
  rate: '1gb', // string format: "{num}(b|kb|mb|gb|B|KB|MB)", max is "1023MB"
  time: 10     // number of seconds to run the test
}
```
```javascript
{ // send a .size buffer, NodeJS will dumps straight to the kernel
  .size: '500mb' // send a 500mbit buffer, same format as .rate
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
