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
var token = {"token":{"token_type":"Bearer","expires_in":"3600","scope":"https://outlook.office.com/mail.read https://outlook.office.com/mail.send https://outlook.office.com/calendars.readwrite","access_token":"EwCAAul3BAAUo4xeBIbHjhBxWOFekj4Xy2fhaGQAAbsd6Avu6DGVJiMDqEgU3Pzmewxc/Jh5amU3lcWAZIZgJGYtuYFNZhYmYxvm4e47KvbSjNRSqoDtfbMunZwFu79FEHIkxlkL1eaIxU4E0BzxovScj4hHu5uFr172GBHN/+CPp1fitc+wxuTuwSJvttkcLtrtenYnaWLYBgiy+1rsJO3wd8t8o5XM6xL3jGX0XiUD+AHIsE4eV62M+EtFPltIBn8eGDTrG+PvF/cpQ9qaN4zdl0m/nTgUITJCH0JY7vPv9mIZIRhESMLBGw4/Z8kyAYzaTcO4I975iSQpEwpjhTARc31EvzOIkTpnDDj2zIm1b6nva/467iG8lQesW08DZgAACKlzN8dAGzGDUAEv+QINBFWF4QbBArjaUVlbOlvCyHu50fMTvjQLpKCEwmFP3cjHXe4XUSSsKp3Bd3e5LvN1g69U2N0Dmjzy7chg9FnOIRy3oAZb/3LKFeY98QGyDo0jVErcvfCOQOFmFhitersYM3oJxGt+oAHttwAHfF+A6yg9hKtYH0o/9p+xpfKX/oSwEuis1mA7c+B2nDgYPGbBvsa0XojOJHkw6bf7H789KmBmISYwsefMfizZhT3LDkyYeQk+53n7Qg3xEp8Sbz0wQHmnurkKgT8eUWHFnSSLWPUK8v6Q5r2xP8dWh170+0OTdiUqnTPBlOZ8aWYAz5qrgMTgBxruFnBTh+YnXmqRzw/kePXBzFlFz+qFpGpiWA4plCKfagP5HgDlV7u1EueEWG0EImqIOVTberh0x+Lyj0uWeMwCYUikr1xNE2PYGwBIdoMkDWnDGqwcTlVrAQ==","expires_at":"2015-12-08T00:48:20.042Z"}};
var mail = "appdev484@outlook.com";

module.exports = function(REQ, ENV, CONFIG) {
	return (value) => {
		console.log("Outlook config: %j", CONFIG);
		let config = template(CONFIG, REQ, ENV, value);
		console.log("Outlook Params: %j", config);

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
							"Address": config.params.email
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