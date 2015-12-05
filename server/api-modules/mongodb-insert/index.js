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
		let config = template(CONFIG, REQ, ENV, value);
		console.log("Params: %j", config);

		var MongoClient = require('mongodb').MongoClient

		let promise = new Promise(function(resolve, reject){
			MongoClient.connect("mongodb://" + config.configuration.hostname + ":" + config.configuration.port + "/" + config.configuration.database, function(err, db) {
				if(err){
					reject(err);
				}

				var collection = db.collection(config.configuration.collection);
				collection.insert(config.params, function(err, documents) {
					if(err){
						reject(err);
					} else{
						if(documents.ops.length == 1){
							resolve(documents.ops[0]);
						} else{
							resolve(documents.ops);
						}
					}
				});
			});
		});

		return promise;
  };
}