module.exports =
{
  "routes": [{
	  "type": "POST",
    "url": "/user/",
	"handles": [
		{
		"module": "mongodb-insert",
		"config": {
			"configuration": {
				"hostname": "{{env.hostname}}",
				"port": "{{env.port}}",
				"database": "{{env.database}}",
				"collection": "testUsers"
			},
			"params": {
				"email": "{{value.email}}",
				"name": "{{value.name}}"
			}
		}
		}]},
 	{
    "type": "POST",
    "url": "/example/:id",
	"handles": [
		{
		"module": "mongodb",
		"config": {
			"configuration": {
				"hostname": "{{env.hostname}}",
				"port": "{{env.port}}",
				"database": "{{env.database}}",
				"collection": "{{value.collection}}"
			},
			"params": {
				"email": "{{value.email}}"
			}
		}
		},
		{
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
		}
	]
    }]
  }