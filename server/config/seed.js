/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Definition = require('../api/definitions/definition.model');
var Module = require('../api/module/module.model');
var Project = require('../api/project/project.model');
var fs = require('fs');
var path = require('path');

Definition.find({}).remove(() => {
  Definition.create({
    "type": "POST",
    "url": "/shoes/",
    "handles": [
      {
      "module": "zalando-articles",
      "x": 100,
      "y": 520,
      "config": {
        "configuration": {
        },
        "params": {
          "fullText": "{{value.fullText}}",
        }
      }
      },
      /*{
      "module": "outlook-send",
      "x": 100,
      "y": 520,
      "config": {
        "configuration": {
        },
        "params": {
          "to": "{{value.to}}",
          "body": "Found a following shoe for you for query '{{value.fullText}}': {{value.content.0.name}}, {{value.content.0.units.0.price.formatted}}. {{value.content.0.shopUrl}}",
          "subject": "{{value.subject}}"
        }
      }
      },*/
      {
      "module": "twilio",
      "x": 100,
      "y": 520,
      "config": {
        "configuration": {
          "accountSid": "{{env.accountSid}}",
          "authToken": "{{env.authToken}}"
        },
        "params": {
          "from": "{{value.from}}",
          "to": "{{value.to}}",
          "body": "Hey, found a new shoe model: {{value.content.0.name}}, {{value.content.0.units.0.price.formatted}}!"
        }
      }}]}),
  Definition.create({
    "type": "POST",
    "url": "/mail/",
    "handles": [
      {
      "module": "outlook-send",
      "config": {
        "configuration": {
        },
        "params": {
          "to": "{{value.to}}",
          "body": "{{value.body}}",
          "subject": "{{value.subject}}"
        }
      }
    }]}),
  Definition.create({
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
    }]}),
  Definition.create({
      "type": "POST",
      "url": "/example/:id",
    "handles": [
      {
      "module": "mongodb",
      "x": 100,
      "y": 150,
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
      "x": 100,
      "y": 520,
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
  });
});

Project.find({}).remove(() => {
  Project.create({
    'name': 'Awesome Hack',
    'settings': [
      { 'key': 'twilioNumber', 'value': '+12398190231' },
      { 'key': 'email', 'value': 'yoda@jedi.com' }
    ]
  });
});

Module.find({}).remove(() => {
  let basePath = path.join(__dirname, '../api-modules');
  let files = fs.readdirSync(basePath);
  files.forEach((file) => {
    let stat = fs.statSync(path.join(basePath, file));
    if (stat.isDirectory()) {
      let defPath = path.join(basePath, file, 'definition.json');
      let exists = fs.existsSync(defPath);
      if (exists) {
        let def = JSON.parse(fs.readFileSync(defPath));
        Module.create(def);
      }
    }
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});