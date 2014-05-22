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
