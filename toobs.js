var net       = require('net'),
    events    = require('events'),
    util      = require('util');


function Server(options) {
  options = options || {};
  server = net.createServer();

  server.on('connection', function(socket) {
    console.log('client connected');
    socket.on('test:started', function() {
      socket._sampler = new Sampler(socket);
      socket.on('sample', function(sample) {
        console.log('SAMPLE: ',sample.bps);
      });
    });
    socket.on('end', function() {
      console.log('wrote: '+socket.bytesWritten);
      console.log('read : '+socket.bytesRead);
    });
  });

  server.listen(options.port || 5000);

  return server;
}


function Client(options) {
  options = options || {};
  var socket = net.connect((options.port || 5000), (options.host || 'localhost'));

  socket.on('connect', function() {
    socket.on('test:started', function() {
      socket._sampler = new Sampler(socket);
      socket.on('sample', function(sample) {
        console.log('SAMPLE: ',sample);
      });
    });
    socket.on('close', function() {
      console.log('wrote: '+socket.bytesWritten);
      console.log('read : '+socket.bytesRead);
    });
  });

  socket.flood = function() {
    console.log('socket._connected: ',socket._connected);
    var buf = new Buffer(1000000); // 1GB
    socket.emit('test:started');
    socket.write(buf, function() {
      socket.emit('test:done');
    }); // send it & end it
  }

  return socket;
}

function Sampler(socket) {
  socket._samples = [
    { bytesRx: 0, bytesTx: 0, time: new Date().getTime()/1000, bps: 0 }
  ];
  var i = setInterval(function() {
    var sample = { bytesRx: socket.bytesRead, bytesTx: socket.bytesWritten, time: new Date().getTime()/1000 },
        last = socket._samples[socket._samples.length-1],
        secs = sample.time - last.time;
    console.log('last: ',last);
    sample.bpsRx = (sample.bytesRx - last.bytesRx) / secs;
    sample.bpsTx = (sample.bytesTx - last.bytesTx) / secs;
    socket._samples.push(sample);
    socket.emit('sample', sample);
  }, 100); // every 0.1 sec
  socket.on('close', function() {
    clearInterval(i);
  });
}

util.inherits(Server, events.EventEmitter);
util.inherits(Client, events.EventEmitter);

var Toobs = {
  Server: Server,
  Client: Client
}

module.exports = Toobs;

/*

  // send 1GB/s for 10 seconds
  // =========================
  var buf = new Buffer(1000000); // 1GB
  var i = setInterval(function() { client.write(buf); }, 1000); // every second
  setTimeout(function() { clearInterval(i); client.destroy(); }, 10000); // for 10 seconds

  // send 1GB as fast as possible
  // ============================
  var buf = new Buffer(1000000); // 1GB
  client.write(buf, function() { client.end(); }); // send it & end it

*/
