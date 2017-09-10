'use strict';

(function () {
  // Subjects Controller Spec
  describe('Subjects Controller Tests', function () {
    // Initialize global variables
    var SubjectsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Subjects,
      mockSubject;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Subjects_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Subjects = _Subjects_;

      // create mock subject
      mockSubject = new Subjects({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Subject about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Subjects controller.
      SubjectsController = $controller('SubjectsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one subject object fetched from XHR', inject(function (Subjects) {
      // Create a sample subjects array that includes the new subject
      var sampleSubjects = [mockSubject];

      // Set GET response
      $httpBackend.expectGET('api/subjects').respond(sampleSubjects);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.subjects).toEqualData(sampleSubjects);
    }));

    it('$scope.findOne() should create an array with one subject object fetched from XHR using a subjectId URL parameter', inject(function (Subjects) {
      // Set the URL parameter
      $stateParams.subjectId = mockSubject._id;

      // Set GET response
      $httpBackend.expectGET(/api\/subjects\/([0-9a-fA-F]{24})$/).respond(mockSubject);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.subject).toEqualData(mockSubject);
    }));

    describe('$scope.create()', function () {
      var sampleSubjectPostData;

      beforeEach(function () {
        // Create a sample subject object
        sampleSubjectPostData = new Subjects({
          title: 'An Subject about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Subject about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Subjects) {
        // Set POST response
        $httpBackend.expectPOST('api/subjects', sampleSubjectPostData).respond(mockSubject);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the subject was created
        expect($location.path.calls.mostRecent().args[0]).toBe('subjects/' + mockSubject._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/subjects', sampleSubjectPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock subject in scope
        scope.subject = mockSubject;
      });

      it('should update a valid subject', inject(function (Subjects) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/subjects\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/subjects/' + mockSubject._id);
      }));

      it('should set scope.error to error response message', inject(function (Subjects) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/subjects\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(subject)', function () {
      beforeEach(function () {
        // Create new subjects array and include the subject
        scope.subjects = [mockSubject, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/subjects\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockSubject);
      });

      it('should send a DELETE request with a valid subjectId and remove the subject from the scope', inject(function (Subjects) {
        expect(scope.subjects.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.subject = mockSubject;

        $httpBackend.expectDELETE(/api\/subjects\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to subjects', function () {
        expect($location.path).toHaveBeenCalledWith('subjects');
      });
    });
  });
}());
