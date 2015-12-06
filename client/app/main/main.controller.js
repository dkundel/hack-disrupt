'use strict';

angular.module('hackDisruptApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $q, $timeout, Definitions) {
    let modulePromise = $http.get('/api/modules').then((resp) => {
      $scope.modules = {};
      resp.data.forEach((mod) => {
        $scope.modules[mod.id] = mod;
      });

      $scope.categories = _.uniq(_.map(resp.data, (mod) => mod.category)).sort();
    });

    $scope.$watch(() => Definitions.Active, () => {
      $scope.configuration = Definitions.Active;
    });

    $q.all([modulePromise]).then(() => {
      $scope.loaded = true;
    });

    $rootScope.$on('api-entry-update', () => {
      $timeout(() => {
        save();
      }, 0);
    });

    $scope.activeCategory = 'All';

    $scope.filterByCategory = (category) => {
      if (category === 'All') {
        $scope.filteredCategories = _.filter($scope.modules, (mod) => true);
      } else {
        $scope.filteredCategories = _.filter($scope.modules, (mod) => mod.category === category);
      }
      $scope.showModuleSelection = true;
    }

    $scope.create = (module) => {
      $scope.showNewDialog = false;
      $scope.showModuleSelection = false;

      let config = {};
      module.config.forEach((c) => {
        config[c.id] = {};
        c.options.forEach((o) => {
          config[c.id][o.id] = '';
        });
      });

      $scope.configuration.handles.push({
        x: 100,
        y: 500,
        module: module.id,
        config: config
      });

      save();
    }

    function save() {
      Definitions.Save(JSON.parse(angular.toJson($scope.configuration)));
    }
  });
