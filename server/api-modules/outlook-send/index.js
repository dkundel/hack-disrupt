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
var token = {"token":{"token_type":"Bearer","expires_in":"3600","scope":"https://outlook.office.com/mail.read https://outlook.office.com/mail.send https://outlook.office.com/calendars.readwrite","access_token":"EwCAAul3BAAUo4xeBIbHjhBxWOFekj4Xy2fhaGQAAXYS4krl56Y3aTdcmeIy5Ntsib1Tm+/lN0zqtgzNcdnt/pag9whsVMqOGZ7GaTZuUTVzAL7hs6SIaYlL7pzzEOXv/2Nmk2+iEvmLOZRIAtjbiBhRbL7ztnZh5EWSgpQcybUB7u0pDkrcK4yxCvsHqUAkL5o9Iu3IklvZggC514g/kXvw8iBuqtQDXvbw9/5hC+MpSOdobHFgKBlSgHOLdvbHdnI/B7YMCXFcy+W64+xtcL3RTMZ4qz9LsHKrot/ZYHc9aW5ghsdeOD5agYKuen5E9iPxZvS8/WkDcl2ULxT3r2J95sr+RQSaIJqDT9yVg1091VMxSFYxkoyM7fiJHm4DZgAACMptlbLhtu/4UAGemp8GKrNeWhFe1JnBfsRER6EIaj0GPfnZ6pcenoNq+LLhWvqkNiR1Dfpa/VkPOkYRinYmi0eFRkVRnBenDAPKvUfqvCAmzhr3PhUucGGJWy5sq8rR3L9p1BAs0PWxacUkEg2ffq9UFaD+hyWnvQ6V0rt/q6zICF/7wGgNWhQ4OdyifOxWYOutdUw0n/FAoTEwEEWnlUn9nEkSVKuBoYRjyMPOLesn244qXuFOPdotVqFtJF26qM88pgZd4RzHlBoGVufIIVRnTPBfdo8y2bxHCsWnoGsTX4rOEKzJVsdshDo9pYeMp7PWeIYkY8uVDEnJhit9EaFMnGiL6wcsepbyNQjNVzc3GffYgyRGcXT8YyyVdHrwBvbmCIqoMWWSGEWm7G74BWNxaO1B8bPvyL1x3/L3IlsYxqX+4ABKjbquVAdtqUfdibhSxyxIrLQuPB9rAQ==","expires_at":"2015-12-07T23:36:20.760Z"}};
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