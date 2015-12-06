'use strict';

angular.module('hackDisruptApp')
  .controller('SidebarCtrl', function ($scope, $location, Auth, Definitions) {
    $scope.$watch(() => Definitions.All, () => {
      $scope.endpoints = Definitions.All
    });

    $scope.Activate = Definitions.GetByIdx;
  });