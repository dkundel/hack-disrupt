'use strict';

angular.module('hackDisruptApp')
  .controller('SidebarCtrl', function ($scope, $location, Auth) {
    $scope.endpoints = [
      { type: 'GET', url: '/examples/:id' },
      { type: 'POST', url: '/examples' },
      { type: 'DELETE', url: '/examples/:id' }
    ];


  });