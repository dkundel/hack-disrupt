'use strict';

angular.module('hackDisruptApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.modules = {
      'twilio': {
        "id": "twilio",
        "name": "Twilio Send SMS",
        "type": "POST",
        "category": "Other",
        "logo": "http://placehold.it/50x50",
        "config": [
          {
            "name": "Configuration",
            "id": "configuration",
            "options": [
              {
                "name": "Account SID",
                "id": "accountSid"
              },
              {
                "name": "Auth Token",
                "id": "authToken"
              }
            ]
          },
          {
            "name": "Parameters",
            "id": "params",
            "options": [
              {
                "name": "From",
                "id": "from"
              },
              {
                "name": "To",
                "id": "to"
              },
              {
                "name": "Message",
                "id": "body"
              }
            ]
          }
        ]
      },
      'mongodb': {
        'id': 'mongodb',
        'name': 'MongoDB',
        'type': 'Find',
        'category': 'Other',
        'logo': 'http://placehold.it/40x40',
        'config': [
          {
            'name': 'Configuration',
            'id': 'configuration',
            'options': [
              {
                'name': 'Database Name',
                'id': 'hostname',
              },
              {
                'name': 'Port',
                'id': 'port'
              },
              {
                'name': 'Hostname',
                'id': 'hostname'
              },
              {
                'name': 'Collection',
                'id': 'collection'
              }
            ]
          },
          {
            'name': 'Parameters',
            'id': 'params',
            'options': [{
              'name': 'Email',
              'id': 'email'
            }]
          }
        ]
      }
    };

    let config = {
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
      "y": 480,
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
  };

    $rootScope.$on('api-entry-update', () => {
      console.dir($scope.configuration.handles);
    });

    $scope.configuration = config;
  });
