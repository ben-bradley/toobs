var toobs = require('../toobs');

var client = new toobs.Client();

client.on('connect', function() {
  console.log(client);
  client.flood();
})
