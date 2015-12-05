'use strict';

var request = require('request'); // npm install request

let template = function(config, req, env, value){
	{}
}

function getToken(callback){
  request.post({
    url: 'https://www.arcgis.com/sharing/rest/oauth2/token/',
    json:true,
    form: {
      'f': 'json',
      'client_id': 'idvb7D9hOAxEKeEI',
      'client_secret': '2f6b165b65e74e338b0aa35717f476ae',
      'grant_type': 'client_credentials',
      'expiration': '1440'
    }
  }, function(error, response, body){
    console.log(body.access_token);
    callback(body.access_token);
  });
}


module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		let req = require('request');

		let callback = function(resolve, reject, err, message) {
			if(err == null){
				reject(err);
			} else {
				resolve(message);
			}
		}
		let promise = new Promise(function(resolve, reject){
			getToken(function(token){
			// sample post to GeoEnrichment REST API
			// returns demographic information for a one mile radius around a point
				request.post({
					url: 'http://geoenrich.arcgis.com/arcgis/rest/services/World/GeoenrichmentServer/Geoenrichment/enrich',
					json:true,
					form: {
					f: 'json',
					token: token,
					studyAreas: '[{"geometry":{"x":-117.1956,"y":34.0572}}]'
					}
				}).on('data', (resp) => {
					console.log(resp.toString());
					resolve(resp.toString());
				}).on('error', (err) => {
					reject(err);
				});
			});
		});

		return promise;
  };
}



