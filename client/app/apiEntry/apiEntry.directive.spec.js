'use strict';

describe('Directive: apiEntry', function () {

  // load the directive's module and view
  beforeEach(module('hackDisruptApp'));
  beforeEach(module('app/apiEntry/apiEntry.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<api-entry></api-entry>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the apiEntry directive');
  }));
});