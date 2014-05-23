#!/usr/bin/env node

var toobs = require('../toobs'),
    args = {};

process.argv.forEach(function(arg) {
  // find --boolean args
  var bln = arg.match(/^--(\w+)$/)
  if (bln)
    args[bln[1]] = true;
  // find --key=value args
  var kv = arg.match(/^--(\w+)=(.+)$/);
  if (kv)
    args[kv[1]] = kv[2];
});

if (args.server) {
  var server = new toobs.Server({ port: (args.port || 5000) });
  server.on('connection', function(socket) {
    console.log('connection form: '+socket.remoteAddress+':'+socket.remotePort+'\n');
    socket.on('test:sample', function(sample) {
      console.log(sample.time+'\tbpsRx='+sample.bpsRx+'\tbpsTx='+sample.bpsTx);
    });
    socket.on('test:done', function(summary) {
      console.log('=================================[ SUMMARY ]=================================');
      console.log(summary);
      console.log('=================================[ SUMMARY ]=================================');
    });
  });
  server.on('listening', console.log('toobs Server listening!\n\n'));
}

if (args.client) {
  if (!args.size && (!args.rate || !args.time))
    throw new Error('Clients need to have a --size or --rate && --time arg');
  var client = new toobs.Client({ port: (args.port || 5000), host: (args.host || 'localhost') });
  client.on('test:sample', function(sample) {
    console.log(sample.time+'\tbpsRx='+sample.bpsRx+'\tbpsTx='+sample.bpsTx);
  });
  client.on('test:done', function(summary) {
    console.log('=================================[ SUMMARY ]=================================');
    console.log(summary);
    console.log('=================================[ SUMMARY ]=================================');
  });
  if (args.size)
    var test = { size: args.size };
  if (args.rate && args.time)
    var test = { rate: args.rate, time: args.time };
  client.test(test);
}
