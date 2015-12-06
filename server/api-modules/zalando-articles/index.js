'use strict';

let template = function(config, req, env, value){
	return {
		params: {
			env: env,
			value: value
		}
	}
}

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		let request = require('request');

		console.log("Zalando params: %j", config);
		var options = {
			method: "GET",
			url: "https://api.zalando.com/articles",
			qs: {
				'fullText': config.params.value.fullText,
				'size': 13,
				'gender': 'male',
				'ageGroup': 'adult',
				'sort': 'popularity',
			}
		};

		let promise = new Promise(function(resolve, reject){
			request(options, (error, response, body) => {
				if(error){reject(error);} else{
				//console.log(response);
				resolve(JSON.parse(body));}
			});
		});

		return promise;
  };
}