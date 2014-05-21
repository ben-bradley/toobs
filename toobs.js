var net = require('net');

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
    { bytesRx: 0, bytesTx: 0, time: new Date().getTime()/1000, BpsRx: 0, BpsTx: 0 }
  ];
  socket._sampler = setInterval(function() {
    var sample = new Sample(socket);
    socket._samples.push(sample);
    socket.emit('sample', sample);
  }, 100); // every 0.1 sec

  // handle events
  socket.on('close', function() {
    clearInterval(socket._sampler);
  });
  socket.on('error', function() {
    // for the moment, just die quietly
  });
  socket.on('end', function() {
    // for the moment, just die quietly
  });
  socket.on('data', function(data) {
    // *sigh* without this, the sampler won't increment
  });
  socket.on('sample', function(sample) {
    if (sample.BpsTx > 0 || sample.BpsRx > 0)
      console.log('!sample', sample);
  });

  // build tests
  socket.rate = function(options) {
    var buf = new Buffer(1000000),
        r = setInterval(function() { socket.write(buf); }, 1000); // send buf every second
    setTimeout(function() {
      clearInterval(r);
      socket.end();
    }, 5000);
  };
  socket.flood = function(options) {
    var buf = new Buffer(1000000);
    socket.write(buf, function() { socket.end(); });
  };

  // return the socket
  return socket;
}

// Sample constructor
// ==================
function Sample(socket) {
  var sample = {
        bytesRx: socket.bytesRead,
        bytesTx: socket.bytesWritten,
        time: new Date().getTime()/1000
      },
      last = socket._samples[socket._samples.length-1],
      secs = sample.time - last.time;
  sample.BpsRx = (sample.bytesRx - last.bytesRx) / secs;
  sample.MBpsRx = Number((sample.BpsRx / 1048576).toFixed(2));
  sample.BpsTx = (sample.bytesTx - last.bytesTx) / secs;
  sample.MBpsTx = Number((sample.BpsTx / 1048576).toFixed(2));
  return sample;
}

module.exports.Server = Server;
module.exports.Client = Client;
