var _ = require('lodash');
var qs = require('querystring');
var crypto = require('crypto');
var debug = require('debug')('esun');

/**
 * @param config        銀行核發的設定
 * @param config.MID        特店代碼
 * @param config.CID        子特店代號
 * @param config.TID        終端機代號
 * @param config.URL        Callback URL
 * @param config.KEY        押碼 KEY
 * @param payload       交易 payload
 * @param payload.ONO       訂單編號
 * @param payload.TA        交易金額
 * @param payload.M         押碼
 */
function creditcard(config, payload) {
  if (typeof config === undefined) throw new Error();
  this.config = config;
  this.payload = {
    ONO: '',
    TA: '',
    M: ''
  };
  if (typeof payload !== undefined) {
    _.merge(this.payload, payload);
  }
}

function _md5(str) {
  debug('md5_str', str);
  debug('md5', crypto.createHash('md5').update(str).digest('hex'));
  return crypto.createHash('md5').update(str).digest('hex');
};


creditcard.prototype.transaction_payload = function() {
  return this.config.MID + '&' + this.config.CID + '&' + this.config.TID + '&' + this.payload.ONO + '&' + this.payload.TA + '&' + this.config.URL + '&' + this.config.KEY;
};

creditcard.prototype.mac = function() {
  this.payload.M = _md5(this.transaction_payload());
  return this.payload.M;
};

creditcard.prototype.verify = function(payload) {
  debug('payload', payload);
  var p = qs.parse(payload);
  var m = p.M;
  delete p.M;
  var str = '';
  for(var attr in p) {
    str += p[attr] + '&';
  }
  str += this.config.KEY
  return _md5(str) === m;
};

module.exports = creditcard;
