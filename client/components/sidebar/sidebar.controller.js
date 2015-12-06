'use strict';

angular.module('hackDisruptApp')
  .controller('SidebarCtrl', function ($scope, $location, $http, Auth, Definitions, $interval) {
    $scope.$watch(() => Definitions.All, () => {
      $scope.endpoints = Definitions.All
    });

    $scope.Activate = Definitions.GetByIdx;
    $scope.Download = Definitions.Download;

    function resetNewEndpoint() {
      $scope.newEndpoint = {
        type: 'GET',
        url: '/',
        handles: []
      };
    }
    resetNewEndpoint();

    $scope.NewSetting = () => {
      $scope.project.settings.push({key: '', value: ''})
    }

    $scope.Add = () => {
      resetNewEndpoint();
      $scope.showAdd = true;
    }

    $scope.CreateNew = () => {
      Definitions.Add(angular.copy($scope.newEndpoint));
      $scope.showAdd = false;
    }

    function Save() {
      $scope.project.settings = _.filter($scope.project.settings, (s) => s.key.length !== 0);
      $http.put(`/api/projects/${$scope.project._id}`, angular.copy($scope.project)).then(() => {
        console.info('SAVED PROJECT');
      });
    }

    $interval(() => {
      Save();
    }, 1000*10);

    angular.element('.download-btn').click(() => {
      $scope.Download();
    });

    $http.get('/api/projects').then((resp) => {
      $scope.project = resp.data[0];
    });
  });