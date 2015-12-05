'use strict';

describe('Directive: apiStage', function () {

  // load the directive's module and view
  beforeEach(module('hackDisruptApp'));
  beforeEach(module('app/apiStage/apiStage.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<api-stage></api-stage>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the apiStage directive');
  }));
});