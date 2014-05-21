var net = require('net');

var client = net.connect(8124, '192.168.1.15');

client.on('connect', function() {

  var start = Math.floor(new Date().getTime()/1000);
  client.setNoDelay(true);

  client.on('data', function(data) {
    console.log('DATA: ', data);
  });

  client.on('close', function() {
    console.log('wrote: '+client.bytesWritten);
    console.log('read : '+client.bytesRead);
    console.log('start: '+start);
    console.log('end  : '+Math.floor(new Date().getTime()/1000));
  });

  // send 1GB/s for 10 seconds
  // =========================
  var buf = new Buffer(1000000); // 1GB
  var i = setInterval(function() { client.write(buf); }, 1000); // every second
  setTimeout(function() { clearInterval(i); client.destroy(); }, 10000); // for 10 seconds

  // send 1GB as fast as possible
  // ============================
  var buf = new Buffer(1000000); // 1GB
  client.write(buf, function() { client.end(); }); // send it & end it

});
