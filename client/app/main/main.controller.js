'use strict';

angular.module('hackDisruptApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.modules = {
      'twilio-send-sms': {
        "id": "twilio-send-sms",
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
                "id": "AccountSid"
              },
              {
                "name": "Token",
                "id": "Token"
              }
            ]
          },
          {
            "name": "POST Parameters",
            "id": "post-parameters",
            "options": [
              {
                "name": "From",
                "id": "From"
              },
              {
                "name": "To",
                "id": "To"
              },
              {
                "name": "Message",
                "id": "Body"
              }
            ]
          }
        ]
      },
      'mongodb-find': {
        'id': 'mongodb-find',
        'name': 'MongoDB',
        'type': 'Find',
        'category': 'Other',
        'logo': 'http://placehold.it/40x40',
        'config': [
          {
            'name': 'Connection',
            'id': 'connection',
            'options': [
              {
                'name': 'Database Name',
                'id': 'dbname'
              }
            ]
          }
        ]
      }
    };

    let config = {
      "request": {
        "type": "GET",
        "url": "/example/:id",
        "handle": {
          "module": "mongodb-find",
          "y": 50,
          "x": 30,
          "config": {
            "connection": {
              "address": "{{ENV.MONGO}}",
              "database": "WhatEver",
              "collection": "people"
            },
            "criteria": {
              "$id": "123"
            }
          },
          "handle": {
            "module": "twilio-send-sms",
            "y": 600,
            "x": 500,
            "config": {
              "configuration": {
                "AccountSid": "{{ENV.TWILIO_ACCOUNT_SID}}",
                "Token": "A hidden token"
              },
              "post-parameters": {
                "From": "+123456789",
                "To": "{{value.Phone}}",
                "Body": "Hi, {{value.Name}}! How are you?"
              }
            }
          }
        }
      }
    };

    convertData(config.request.handle);
    $scope.fullConfig = config.request;

    function convertData(configuration) {
      $scope.connections = [];
      $scope.entries = [];
      while(configuration.handle) {
        let current = $scope.entries.length;
        $scope.entries.push(angular.copy(configuration));
        delete $scope.entries[current].handle;
        $scope.connections.push({from: current, to: current+1});
        configuration = configuration.handle;
      }
      $scope.entries.push(configuration);

      $rootScope.$on('api-entry-update', () => {
        console.dir($scope.entries);
      });
    }
  });
