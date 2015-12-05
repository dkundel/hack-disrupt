module.exports =
{
  "routes": [{
    "type": "POST",
    "url": "/example/:id",
	"handles": [{
	"module": "twilio",
	"config": {
		"configuration": {
			"accountSid": "{{env.accountSid}}",
			"authToken": "{{env.authToken}}"
		},
		"params": {
			"from": "{{value.from}}",
			"to": "{{value.to}}",
			"body": "Hi, {{value.name}}! How are you?"
		}
	}
	}]
    }]
  }