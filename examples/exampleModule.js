module.exports = function(REQ, ENV, CONFIG) {
  return (value) => {
    var config = utils.template(CONFIG, REQ, ENV, value);

    var twilio = require('twilio')(config.configuration.AccountSid, 'sdafsdf');

    return promise;
  };
}