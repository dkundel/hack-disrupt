'use strict';

let template = function(config, req, env, value){
	return {
		configuration: {
			accountSid: env.accountSid || '***REMOVED***',
			authToken: env.authToken || '***REMOVED***'
		},
		params: {
			to: value.to || "***REMOVED***",
			from: value.from || "+441915801692",
			body: value.body || "Test",
		}
	}
}

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		let client = require('twilio')(config.configuration.accountSid, config.configuration.authToken);

		let callback = function(resolve, reject, err, message) {
			if(err == null){
				reject(err);
			} else{
				resolve(message);
			}
		}
		let promise = new Promise(function(resolve, reject){
			client.messages.create(config.params, (err, message) => callback(resolve, reject, err, message));
		});

		return promise;
  };
}