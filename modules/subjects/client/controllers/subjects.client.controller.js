'use strict';

// Subjects controller
angular.module('subjects').controller('SubjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subjects',
  function ($scope, $stateParams, $location, Authentication, Subjects) {
    $scope.authentication = Authentication;

    // Create new Subject
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'subjectForm');
        return false;
      }

      // Create new Subject object
      var subject = new Subjects({
        subjectName: this.subjectName,
        marks: this.marks
      });

      // Redirect after save
      subject.$save(function (response) {
        $location.path('subjects/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Subject
    $scope.remove = function (subject) {
      if (confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
        if (subject) {
          subject.$remove();

          for (var i in $scope.subjects) {
            if ($scope.subjects[i] === subject) {
              $scope.subjects.splice(i, 1);
            }
          }
        } else {
          $scope.subject.$remove(function () {
            $location.path('subjects');
          });
        }
      }
    };

    // Update existing Subject
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'subjectForm');
        return false;
      }

      var subject = $scope.subject;

      subject.$update(function () {
        $location.path('subjects/' + subject._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Subjects
    $scope.find = function () {
      $scope.subjects = Subjects.query();
    };

    // Find existing Subject
    $scope.findOne = function () {
      $scope.subject = Subjects.get({
        subjectId: $stateParams.subjectId
      });
    };

    // Find existing Subject
    $scope.findOneForUpdate = function () {
      $scope.subject = Subjects.get({
        subjectId: $stateParams.subjectId
      });

      var userId = $stateParams.userId;
      var reqObject = {userId: userId};

      Subjects.getUserByUserId(reqObject,
        function (response) {
          $scope.user = response;
        },
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };

    $scope.initSubject = function () {
      var userId = $stateParams.userId;
      var reqObject = {userId: userId};
      Subjects.getSubjectListByUserId(reqObject,
        function (response) {
          $scope.subjectList = response;
        },
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

      Subjects.getUserByUserId(reqObject,
        function (response) {
          $scope.user = response;
        },
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };

    // add subject by admin
    $scope.add = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'subjectForm');
        return false;
      }

      // Create new Subject object
      var subject = new Subjects({
        subjectName: this.subjectName,
        marks: this.marks,
        user: $scope.user._id
      });

      Subjects.addSubjectByAdmin(subject,
        function (response) {
          $scope.initSubject();
          // Clear form fields
          $scope.subjectName = '';
          $scope.marks = '';
        },
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };

    // Remove existing Subject
    $scope.removeByAdmin = function (subject) {
      if (confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
        if (subject) {
          subject.$remove();
          $scope.initSubject();
        }
      }
    };

    // Update existing Subject
    $scope.updateByAdmin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'subjectForm');
        return false;
      }

      var subject = $scope.subject;

      subject.$update(function () {
        $location.path('subjects/add/' + $scope.user._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

  }
]);
