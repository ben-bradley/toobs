var toobs = require('../toobs');

var server = new toobs.Server();

server.on('connection', function(socket) {
  console.log('=========================');
})
