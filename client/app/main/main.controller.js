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

    $rootScope.$on('api-entry-delete', (evt, idx) => {
      $scope.configuration.handles.splice(idx, 1);
      $timeout(() => {
        save();
      }, 0);
    });

    let swapVar;
    let swapIdx;
    let isSwapping = false;
    $rootScope.$on('api-entry-swap', (evt, idx) => {
      if (!isSwapping) {
        swapVar = $scope.configuration.handles[idx];
        swapIdx = idx;
        isSwapping = true;
      } else {
        $scope.configuration.handles[swapIdx] = $scope.configuration.handles[idx];
        $scope.configuration.handles[idx] = swapVar;
        isSwapping = false;
        save();
      }
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
      if (module.config) {
        module.config.forEach((c) => {
          config[c.id] = {};
          if (c.options) {
            c.options.forEach((o) => {
              config[c.id][o.id] = '';
            });
          }
        });
      }

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
