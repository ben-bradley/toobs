var net = require('net');

// conversion rates for 1 {{key}} to Bytes/sec
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

// Server constructor
// ==================
function Server(options) {
  options = options || {};
  return net.createServer(function(socket) {
    socket = new Socket(socket);
  }).listen(options.port || 5000);
};

// Client constructor
// ==================
function Client(options) {
  options = options || {};
  return new Socket(net.connect((options.port || 5000), (options.host || 'localhost')));
};

// Socket constructor
// ==================
function Socket(socket) {

  // build the sampler
  socket._samples = [
    { bitsRx: 0, bitsTx: 0, time: new Date().getTime(), bpsRx: 0, bpsTx: 0 }
  ];
  socket._sampler = setInterval(function() {
    var sample = new Sample(socket);
    socket._samples.push(sample);
    socket.emit('test:sample', sample);
  }, 1000); // every 1 sec

  // handle events
  socket.on('close', function() {
    clearInterval(socket._sampler);
  });

  socket.on('error', function() {
    // for the moment, just die quietly
  });

  socket.on('end', function() {
    var samples = socket._samples.slice();
    samples.shift();
    var summary = {
      samples: samples,
      start: samples[0].time,
      end: samples[samples.length-1].time,
      options: (socket._testOptions || { remote: true })
    };
    socket.emit('test:done', summary);
  });

  socket.on('data', function(data) {
    // *sigh* without this, the sampler won't increment
  });

  socket.test = function(options) {
    var rate, time, size, buf;
    socket._testOptions = options;
    // normalize size or rate to bytes
    if (options.rate) {
      rate = options.rate.match(/^(\d+)(.+)$/);
      if (!BYTES[rate[2]])
        throw new Error('Invalid rate: '+options.rate);
      time = (options.time || 10) * 1000;
      if (!time)
        throw new Error('Invalid time: '+options.time);
      buf = new Buffer(Number(rate[1]) * BYTES[rate[2]]);
    }
    else if (options.size) {
      size = options.size.match(/^(\d+)(.+)$/);
      if (!BYTES[size[2]])
        throw new Error('Invalid size: '+options.size);
      buf = new Buffer(Number(size[1]) * BYTES[size[2]])
    }
    // start the test
    if (rate && time) {
      socket.emit('test:start');
      var r = setInterval(function() { socket.write(buf); }, 1000);
      setTimeout(function() {
        clearInterval(r);
        socket.end();
      }, time);
    }
    else if (size) {
      socket.emit('test:start');
      socket.write(buf, function() {
        socket.end();
      });
    }
  };

  // return the socket
  return socket;
};

// Sample constructor
// ==================
function Sample(socket) {
  var sample = {
        bitsRx: socket.bytesRead*8,
        bitsTx: socket.bytesWritten*8,
        time: new Date().getTime()
      },
      last = socket._samples[socket._samples.length-1],
      secs = (sample.time/1000) - (last.time/1000);
  sample.bpsRx = Math.floor((sample.bitsRx - last.bitsRx) / secs);
  sample.bpsTx = Math.floor((sample.bitsTx - last.bitsTx) / secs);
  return sample;
}

module.exports.Server = Server;
module.exports.Client = Client;
