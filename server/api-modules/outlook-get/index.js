'use strict';

var hbs = require('handlebars');

let template = function(config, req, env, value){
	let compiled = hbs.compile(JSON.stringify(config));
	return JSON.parse(compiled({
		value: value,
	}));
}

var request = require('request');
var uuid = require('node-uuid');

// Hardcoded to avoid the effort of authenticating and saving it to sessions... (Hackathon style ;)
var token = {"token":{"token_type":"Bearer","expires_in":"3600","scope":"https://outlook.office.com/mail.send","access_token":"EwCAAul3BAAUo4xeBIbHjhBxWOFekj4Xy2fhaGQAAceODYz+UOuNQz8ZHrA6t0UX5bI2BwIZnFRMvW64CCChRNrpUGo89COV7p2Um+13eWNhSLODy0Lfevk+zFLRqTuLw2W+9OoQ+hCjYoVBKhROo+ZBjXAmsmDutwRPovHR4O6DYGKytt0g7tpmO8fV8lUJpX34Tq7Yv7qyMYHfk2SgttNFneiOpwonCL0nVxSpHWUt/n1+DF+kbUU/SXVX9PEAbpqk2mDJd2qWfMHVbeMbfMWBTHquB2SUNLW9y0ObZBZ/rLW/Zk6GibSDdNWkBSRkUgJZ+ror/M9eoYHrHr2C9gmKpRuuLuKAUEaoNuR7FD7RetTYwpenekN0nZ4zvXIDZgAACIUrwWE3AnF7UAHeLIb5RGS3pQlewBxXSwpZFf+cFVw4wwlRI9kpCSvWxwsjARyQqIxf5ds/WexJXVQIJ49InBTzGm3/JnJr3y+kvINotXqfE+cQJABBT6odiz5sdd5HXjOBoGaUI2eoMdOnHnQiUYRlB70b20cE0NquVWDwQpsLbUr9KYbN394NN93Ck9MLRLe44aNoQF8uWgTYJnA958m1HSuTbWRh6/jFW3LXgkrcL7761H0oImtBGu1iIJncxM7uNq9GqRXjVrI2WPnDlnNMNJtz1T572htD2ltiH3bYTLkT0Rzq94jHetCWF/xTCPX7mokjdTNdmfd4aLCZebhhFO9MZTmyQ1iO+IskKVF7qbN7klNb8pT66XVswrmHi9MS86hIPUEEoC8EI/yRTe4vaPwEz8J3EXOCArYrL2sne4mg9xqXk20cc80ShGhcgBOaz0P2keFJjaVrAQ==","expires_at":"2015-12-12T04:19:20.768Z"}};
var mail = "appdev484@outlook.com";

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		console.log("Params: %j", config);

		var headers = {};
		headers['Accept'] = 'text/*, application/xml, application/json; odata.metadata=none';
  		headers['Content-Type'] = 'application/x-www-form-urlencoded';
  		headers['User-Agent'] = 'node-outlook/2.0';
		headers['client-request-id'] = uuid.v4();
		headers['return-client-request-id'] = 'true';
		headers['X-Anchor-Mailbox'] = mail;
		headers['Authorization'] = 'Bearer ' + token.token.access_token;
		var options = {
			method: "GET",
			url: "https://outlook.office.com/api/v2.0/users/appdev484@outlook.com/mailfolders/inbox/messages",
			headers: headers,
			qs: {
				'$top': config.params.top
			}
		};

		let callback = function(resolve, reject, err, message) {
			if(err != null){
				reject(err);
			} else{
				resolve(message);
			}
		}
		let promise = new Promise(function(resolve, reject){
			request.get(options, function(error, response, body){
				//console.log("Error:" + error);
				//console.log("Response: " + JSON.stringify(response));
				//console.log("Body: " + JSON.stringify(body));
				callback(resolve, reject, error, response);
			});
		});

		return promise;
  };
}