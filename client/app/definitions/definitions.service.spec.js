'use strict';

describe('Service: definitions', function () {

  // load the service's module
  beforeEach(module('hackDisruptApp'));

  // instantiate service
  var definitions;
  beforeEach(inject(function (_definitions_) {
    definitions = _definitions_;
  }));

  it('should do something', function () {
    expect(!!definitions).toBe(true);
  });

});
