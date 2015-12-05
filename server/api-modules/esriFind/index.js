'use strict';

var request = require('request'); // npm install request

let template = function(config, req, env, value){
	return {
		params: {
			address: value.address || "380+New+York+Street%2C+Redlands%2C+CA+92373",
		}
	}
}

// http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text=380+New+York+Street%2C+Redlands%2C+CA+92373&f=pjson


module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		let req = require('request');

		let promise = new Promise(function(resolve, reject){
			request.get('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?text='+ config.params.address + '&f=pjson').on('data', (resp) => {
				console.log(resp.toString());
				resolve(resp.toString());
			}).on('error', (err) => {
				reject(err);	
			});
		});

		return promise;
  };
}



