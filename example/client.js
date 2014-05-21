var toobs = require('../toobs');

var client = new toobs.Client({ host: '192.168.1.14' });

client.on('connect', function() {
  client.flood();
});
