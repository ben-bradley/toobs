var net = require('net');

var server = net.createServer();

server.on('connection', function(socket) {
  console.log('connected!');

  socket.on('end', function() {
    console.log('wrote: '+socket.bytesWritten);
    console.log('read : '+socket.bytesRead);
  });

  socket.on('data', function(data) {
  });

});

server.listen(8124);
