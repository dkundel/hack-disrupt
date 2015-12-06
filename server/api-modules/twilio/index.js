'use strict';

var hbs = require('handlebars');

let template = function(config, req, env, value){
	let compiled = hbs.compile(JSON.stringify(config));
	return JSON.parse(compiled({
		value: value,
		env: env
	}));
}

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		//console.log(value.content[0].units);
		//console.log("Value: %j", value);
		let config = template(CONFIG, REQ, ENV, value);
		console.log("Params: %j", config);
		let client = require('twilio')(config.configuration.accountSid, config.configuration.authToken);

		let callback = function(resolve, reject, err, message) {
			if(err != null){
				reject(err);
			} else{
				resolve(message);
			}
		}
		let promise = new Promise(function(resolve, reject){
			//callback(resolve, reject, null, "msg");
			client.messages.create(config.params, (err, message) => callback(resolve, reject, err, message));
		});

		return promise;
  };
}