# toobs [![Build Status](https://secure.travis-ci.org/ben-bradley/toobs.png)](http://travis-ci.org/ben-bradley/toobs) [![NPM](https://nodei.co/npm/toobs.png?downloads=true)](https://nodei.co/npm/toobs/)

A network speed testing tool for NodeJS.
*Still in development, don't use this yet!*

## Install

`npm install ben-bradley/toobs`

## Test

Coming ~~soon~~ eventually...
`cd node_modules/ping-lite && mocha`

## Usage

See the examples for more detail

```Javascript
var toobs = require('toobs');

var server = new toobs.Server({ port: 5000 });

var client = new toobs.Client({ host: 'localhost', port: 5000 });

client.on('connect', function() {
  client.flood();  // start a flood test, sends 1GB of data as fast as possible
});
```

## Events

- Socket
  - [Class `net.Socket` events](http://nodejs.org/api/net.html#net_class_net_socket)
  - `sample` - Returns an object containing the details of the most recent sample of traffic:
```javascript
{
  time: <ms>,
  bytesTx: 1234,
  bytesRx: 4321,
  BpsTx: 6789,
  BpsRx: 9876,
  MBpsTx: 0.12,
  MBpsRx: 0.21
}
```

## Methods


## Examples

For now, check the `examples/` folder, but I will build this out once toobs comes out of dev
