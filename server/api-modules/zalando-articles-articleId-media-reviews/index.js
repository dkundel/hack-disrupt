'use strict';

let template = function(config, req, env, value){
	return {
		params: {
		    articleId: value.articleId || "N1241M00F-G11",
		}
	}
}

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		let request = require('request');

		let promise = new Promise(function(resolve, reject){
			request.get('https://api.zalando.com/articles/' + config.params.articleId + '/reviews').on('data', (resp) => {
				console.log(resp.toString());
				resolve(resp.toString());
			}).on('error', (err) => {
				reject(err);	
			});
		});

		return promise;
  };
}