'use strict';

let template = function(config, req, env, value){
	return {
		params: {
		}
	}
}

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		let request = require('request');

		// let callback = function(resolve, reject, err, message) {
		// 	if(err == null){
		// 		reject(err);
		// 	} else {
		// 		resolve(message);
		// 	}
		// }

		let promise = new Promise(function(resolve, reject){
			request.get('https://api.zalando.com/brands/').on('data', (resp) => {
				console.log(resp.toString());
				resolve(resp.toString());
			}).on('error', (err) => {
				reject(err);	
			});
		});

		return promise;
  };
}