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
