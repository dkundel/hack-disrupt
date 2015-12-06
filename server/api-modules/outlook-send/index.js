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
var token = {"token":{"token_type":"Bearer","expires_in":"3600","scope":"https://outlook.office.com/mail.read https://outlook.office.com/mail.send https://outlook.office.com/calendars.readwrite","access_token":"EwCAAul3BAAUo4xeBIbHjhBxWOFekj4Xy2fhaGQAATMk70rzuiN5bN7AIwTaJAOu9AooVRTfh9ORrmjEkNWXohPvMjUmmysYnSahWO1Ofx19+JUjEXcHLoWk4TNeAlYAu/KZfl/F5ybCh12BYlbB5qvuCd+pDqs/3ONmo8J7mTFuMC2rgJhFiArlm/fdqGItIIW+9BHSTgnZsuK65pbi/ZcCvDgC8eSrJzg0sHbr4ODPrIvHkxJ/e8HElwE2afRRMM6wECCq/Ci0LhwCGvtWeDfkDxG1BlTXxy+V+JuQpH1Rl0Z+Me0h1lyf51IQrYNe0FXqjsWLIGNu7z+BncAFKeRzBcbo9XD5GY1Ice+0Sad0Heyp3o1vvb7erNe53JUDZgAACFiqjJDKYlD2UAF8A2/k6jTOD4Fse/qBqtUeOFX/iXCphXHDn2CAdjgkXbujhE3Fv7xmzB7CapFcyqCrjBW+mKYvaLu9Lrm2nBTGJiUku3BJ+11cZMK0tDU5KtiWWymnaSUzPkGGDfp/2OjlKw1cbjzQSgfLDU/GXZLRYDc19+5Zu7mOV1ByPDeW4tDIwkoxw2BSR4ShaZg29GGMRBKkdLA3ynX/G9qQAxDQ080lu3N/yZOxPjaNrG8Jj4WvsooEyiImTRA3SR3BzRiKai/yfe/lA9iaT+Y6JRK5Hi84j1tN5IDl/+OeMs3rCiAl1cYRvzqC2uFewtZEMvdrJPnAPAjyb75mmvpa36vF1LB/YRwzUmq3vOcP2Y/mXerFkfck/kovUXFCAQBnnq/6FrlCyWcW2o8dYp9+1mi7oFJ+b2V2vL3bnp+mgz5zfRWSPKqH5uL5Mnrgkwq3OMZrAQ==","expires_at":"2015-12-06T09:53:00.607Z"}};
var mail = "appdev484@outlook.com";

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