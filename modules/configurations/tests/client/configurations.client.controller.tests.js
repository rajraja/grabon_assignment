'use strict';

(function () {
  // Configurations Controller Spec
  describe('Configurations Controller Tests', function () {
    // Initialize global variables
    var ConfigurationsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Configurations,
      mockConfiguration;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Configurations_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Configurations = _Configurations_;

      // create mock configuration
      mockConfiguration = new Configurations({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Configuration about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Configurations controller.
      ConfigurationsController = $controller('ConfigurationsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one configuration object fetched from XHR', inject(function (Configurations) {
      // Create a sample configurations array that includes the new configuration
      var sampleConfigurations = [mockConfiguration];

      // Set GET response
      $httpBackend.expectGET('api/configurations').respond(sampleConfigurations);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.configurations).toEqualData(sampleConfigurations);
    }));

    it('$scope.findOne() should create an array with one configuration object fetched from XHR using a configurationId URL parameter', inject(function (Configurations) {
      // Set the URL parameter
      $stateParams.configurationId = mockConfiguration._id;

      // Set GET response
      $httpBackend.expectGET(/api\/configurations\/([0-9a-fA-F]{24})$/).respond(mockConfiguration);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.configuration).toEqualData(mockConfiguration);
    }));

    describe('$scope.create()', function () {
      var sampleConfigurationPostData;

      beforeEach(function () {
        // Create a sample configuration object
        sampleConfigurationPostData = new Configurations({
          title: 'An Configuration about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Configuration about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Configurations) {
        // Set POST response
        $httpBackend.expectPOST('api/configurations', sampleConfigurationPostData).respond(mockConfiguration);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the configuration was created
        expect($location.path.calls.mostRecent().args[0]).toBe('configurations/' + mockConfiguration._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/configurations', sampleConfigurationPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock configuration in scope
        scope.configuration = mockConfiguration;
      });

      it('should update a valid configuration', inject(function (Configurations) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/configurations\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/configurations/' + mockConfiguration._id);
      }));

      it('should set scope.error to error response message', inject(function (Configurations) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/configurations\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(configuration)', function () {
      beforeEach(function () {
        // Create new configurations array and include the configuration
        scope.configurations = [mockConfiguration, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/configurations\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockConfiguration);
      });

      it('should send a DELETE request with a valid configurationId and remove the configuration from the scope', inject(function (Configurations) {
        expect(scope.configurations.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.configuration = mockConfiguration;

        $httpBackend.expectDELETE(/api\/configurations\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to configurations', function () {
        expect($location.path).toHaveBeenCalledWith('configurations');
      });
    });
  });
}());
