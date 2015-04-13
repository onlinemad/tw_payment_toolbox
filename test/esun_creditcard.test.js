var expect = require('chai').expect;

var ESUN = require('../lib/esun');

describe('ESUN.creditcard', function() {
  var sample_config = {
    MID: '8080011817',
    CID: '',
    TID: 'EC000001',
    URL: '/TestACQ/print.html',
    KEY: 'TNN4HI4VJLYD92RA7X9X93NWLIGAGI0K'
  }
  var sample_payload = {
    ONO: '1285223782714',
    TA: '250'
  }
  describe('#constructor(config, payload)', function() {
    it('should new a payload object with passed payload object.', function(done) {
      var esun = new ESUN.creditcard(sample_config, sample_payload);
      for (var property in sample_config) {
        expect(esun.config[property]).to.equal(sample_config[property]);
      }
      for (var property in sample_payload) {
        expect(esun.payload[property]).to.equal(sample_payload[property]);
      }
      done();
    });
  });
  describe('#transaction_payload()', function() {
    it('should generate processed payload for hashing mac.', function(done) {
      var transaction_payload = '8080011817&&EC000001&1285223782714&250&/TestACQ/print.html&TNN4HI4VJLYD92RA7X9X93NWLIGAGI0K';
      var esun = new ESUN.creditcard(sample_config, sample_payload);
      expect(esun.transaction_payload()).to.equal(transaction_payload);
      done();
    });
  });
  describe('#mac()', function() {
    it('should get payload hashed value.', function(done) {
      var mac = '7c55479639bfdd8c30a777b526a02db5';
      var esun = new ESUN.creditcard(sample_config, sample_payload);
      expect(esun.mac()).to.equal(mac);
      done();
    });
  });
  describe('#verify(payload)', function() {
    it('should verify payload is verified or not.', function(done) {
      var response_payload = 'RC=00&MID=8080011817&ONO=1362984693411&LTD=20130311&LTT=145258&RRN=023070000003&AIR=055080&AN=356068******0225&M=7624d434ad3339174641fb4e5ca97bac'
      var esun = new ESUN.creditcard(sample_config, sample_payload);
      expect(esun.verify(response_payload)).to.be.true;
      done();
    });
  });


});
