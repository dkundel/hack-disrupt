'use strict';

let template = function(config, req, env, value){
	return {
		configuration: {
			accountSid: env.accountSid,
			authToken: env.authToken
		},
		params: {
			to: value.to,
			from: value.from,
			body: value.body,
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