'use strict';

describe('Configurations E2E Tests:', function () {
  describe('Test configurations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/configurations');
      expect(element.all(by.repeater('configuration in configurations')).count()).toEqual(0);
    });
  });
});
