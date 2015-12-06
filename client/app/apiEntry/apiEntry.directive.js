'use strict';

(function () {
  let directive = function ($rootScope) {
    return {
      templateUrl: 'app/apiEntry/apiEntry.html',
      restrict: 'E',
      replace: true,
      scope: {
        configuration: '=config',
        module: '=module',
        x: '=x',
        y: '=y',
        idx: '@index'
      },
      link: function (scope, element, attrs) {
        let index = parseInt(scope.idx, 10);
        let onDrag = () => {
          $rootScope.$broadcast('api-entry-moving');
        }

        scope.delete = () => {
          $rootScope.$broadcast('api-entry-delete', scope.idx);
        }

        scope.swap = () => {
          $rootScope.$broadcast('api-entry-swap', index);
        }

        let onStop = () => {
          scope.y = element.position().top;
          scope.x = element.position().left;
          scope.$apply(() => {
            $rootScope.$broadcast('api-entry-update');
          });

        }

        element.draggable({grid: [20,20], containment: 'parent', drag: onDrag, stop: onStop});
        element.css({top: scope.y, left: scope.x});

        if (Object.keys(scope.configuration).length === 0) {
          Object.keys(scope.module.config).forEach((conf) => {
            scope.configuration[conf.id] = {};
            Object.keys(conf.options).forEach((opt) => {
              scope.configuration[conf.id][opt.id] = '';
            });
          });
        }
      }
    };
  };

  directive.$inject = ['$rootScope'];

  angular.module('hackDisruptApp')
    .directive('apiEntry', directive);
})()