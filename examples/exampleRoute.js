var app;
var ENV;

app.get('/example/:id', (req, res, next) => {
  require('./api-modules/mongodb-find')(req, ENV, {
    "connection": {
      "address": "{{ENV.MONGO}}",
      "database": "WhatEver",
      "collection": "people"
    },
    "criteria": {
      "$id": "123"
    }
  })
  .then(require('./api-modules/foreach')(req, ENV,
    require('./api-modules/twilio-send-sms')(req, ENV, {
      "configuration": {
        "AccountSid": "{{ENV.TWILIO_ACCOUNT_SID}}",
        "Token": "A hidden token"
      },
      "post-parameters": {
        "From": "+123456789",
        "To": "{{value.Phone}}",
        "Body": "Hi, {{value.Name}}! How are you?"
      }
    }))
  )
  .finally(require('./api-modules/return')(req, ENV, res))
});