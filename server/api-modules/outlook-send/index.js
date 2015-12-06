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

// HardCoed to avoid the effort of authenticating and saving it to sessions... (Hackathon style ;)
var token = {"token":{"token_type":"Bearer","expires_in":"3600","scope":"https://outlook.office.com/mail.send","access_token":"EwB4Aul3BAAUo4xeBIbHjhBxWOFekj4Xy2fhaGQAAUdSG2/quTh64llGg78x7irSSTrnce0lUzfNnY0t3FMNhv2fumuZXzt4fOhxWfQOQUPYm+yaiVCgrRQyuXm7nZKb4KaMcUJmDfypiS+XdkFEFHfXDTPXrPZAf9Gm58JRc3ZnaA0JHBTLp/kfcSGgHAa2vyCX7Zg6zmCzoJW14w+ofxmfLKP46UrwJ294KeyQL8+pfR/7cxkhrEVElyYNTJTl0eLBXn+BVUvL91MxJXk4H8fj1PmaT0UhZa8Pv8W3DAIc8usVa9GzBmSxx4GGGlUGYKIZL/YtqahfpeFdgtfUHTwebsNb7VYvDS2phoV03loWHSFVVPeCI9Pd6DzXnigDZgAACL2y6jUl7YbzSAFKsW/E9sG4erRe1YmP6Y/rf7jFmdEXGmUI+dJI4lplC9Y4TOupP4fPrpyn+La7jFoDol0muFIgveW1wr86uUZzYufmKE+vYqEOo/ajwq5RQQNUTJd6NzqNAT3u8pVoGovgQk1beVlIHN99xLc3S+vgUYKTf4igApflp/3e+v0Q4FuS9WchgAhEvAKklHAHrkX7oTnw37fEoWd2dNmd5vReJzSLjHMY+wb+KCqT6i+qjveQwyElE1z1ep0xoqMBFnw5aid1dmJGqHVI6Ey7VQ+AZHODmX4mcmwA6IpN8zawmPceW1Ocq4brpBuIicTAR9dSYpNajrwAvRd1w35wEciv1wtl2m2DOt5vpTXZx5fQWe+xC+lNV0Qk2vWF2zhxakeXhhnOnD96e1Pw6wabIlXHN23VIsmqxZjoG0fSJ4wF+GcD8F7XuNnPYwE=","expires_at":"2015-12-12T04:19:20.768Z"}};
var mail = "appdev484@outlook.com";

exports.send = function(req, res) {

};

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		let config = template(CONFIG, REQ, ENV, value);
		console.log("Params: %j", config);

		var headers = {};
		headers['Accept'] = 'application/json';
		headers['Content-Type'] = 'application/json';
		headers['User-Agent'] = 'node-outlook/2.0';
		headers['client-request-id'] = uuid.v4();
		headers['return-client-request-id'] = 'true';
		headers['X-Anchor-Mailbox'] = mail;
		headers['Authorization'] = 'Bearer ' + token.token.access_token;
		var options = {
			method: "POST",
			url: "https://outlook.office.com/api/v2.0/users/appdev484@outlook.com/sendmail",
			headers: headers,
			json: true,
				body: {
				"Message": {
					"Subject": config.params.subject,
					"Body": {
					"ContentType": "Text",
					"Content": config.params.body
					},
					"ToRecipients": [
					{
						"EmailAddress": {
							"Address": config.params.to
						}
					}
					]
				}
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
			request.post(options, function(error, response, body){
				//console.log("Error:" + error);
				//console.log("Response: " + JSON.stringify(response));
				//console.log("Body: " + JSON.stringify(body));
				callback(resolve, reject, error, response);
			});
		});

		return promise;
  };
}