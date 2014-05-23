var assert = require('assert');
var toobs = require('../toobs')

describe('Toobs', function() {

  var server, client;
  beforeEach(function() {
    server = new toobs.Server({ port: 5001 });
    client = new toobs.Client({ port: 5001 });
  });
  afterEach(function() {
    client.end();
    server.close();
  });

  it('should have a .Server() & .Client()', function() {
    assert.equal(typeof toobs.Server, 'function');
    assert.equal(typeof toobs.Client, 'function');
  });

  describe('Server()', function() {

    it('Sockets should emit test:samples', function(done) {
      this.timeout(4000);
      server.on('connection', function(socket) {
        socket.on('test:sample', function(sample) {
          assert.equal(typeof sample, 'object', 'sample should be an object');
          assert.equal(typeof sample.time, 'number', 'sample.time should be a number');
          assert.equal(typeof sample.bitsRx, 'number', 'sample.bitsRx should be a number');
          assert.equal(typeof sample.bitsTx, 'number', 'sample.bitsTx should be a number');
          assert.equal(typeof sample.bpsRx, 'number', 'sample.bpsRx should be a number');
          assert.equal(typeof sample.bpsTx, 'number', 'sample.bpsTx should be a number');
          done();
        });
      });
      client.test({ rate: '1mb', time: 3 })
    });

    it('Sockets should emit test:done', function(done) {
      this.timeout(4000);
      server.on('connection', function(socket) {
        socket.on('test:done', function(summary) {
          assert.equal(typeof summary, 'object', 'summary should be an object');
          assert.equal(typeof summary.samples, 'object', 'summary.samples should be an array');
          assert.equal(typeof summary.start, 'number', 'summary.start should be a number');
          assert.equal(typeof summary.end, 'number', 'summary.end should be a number');
          assert.equal(typeof summary.options, 'object', 'summary.options should be an object');
          done();
        });
      });
      client.test({ rate: '1mb', time: 3 })
    });

  });

  describe('Client()', function() {

    it('should emit test:samples', function(done) {
      this.timeout(4000);
      client.on('test:sample', function(sample) {
        assert.equal(typeof sample, 'object', 'sample should be an object');
        assert.equal(typeof sample.time, 'number', 'sample.time should be a number');
        assert.equal(typeof sample.bitsRx, 'number', 'sample.bitsRx should be a number');
        assert.equal(typeof sample.bitsTx, 'number', 'sample.bitsTx should be a number');
        assert.equal(typeof sample.bpsRx, 'number', 'sample.bpsRx should be a number');
        assert.equal(typeof sample.bpsTx, 'number', 'sample.bpsTx should be a number');
        done();
      });
      client.test({ rate: '1mb', time: 3 })
    });

    it('should emit test:start', function(done) {
      this.timeout(4000);
      client.on('test:start', function() {
        done();
      });
      client.test({ size: '1mb' })
    });

    it('should emit test:done', function(done) {
      this.timeout(4000);
      client.on('test:done', function(summary) {
        assert.equal(typeof summary, 'object', 'summary should be an object');
        assert.equal(typeof summary.samples, 'object', 'summary.samples should be an array');
        assert.equal(typeof summary.start, 'number', 'summary.start should be a number');
        assert.equal(typeof summary.end, 'number', 'summary.end should be a number');
        assert.equal(typeof summary.options, 'object', 'summary.options should be an object');
        done();
      });
      client.test({ rate: '1mb', time: 3 })
    });

  });

});
