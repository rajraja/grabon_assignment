'use strict';

// Configurations controller
angular.module('configurations').controller('ConfigurationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Configurations',
  function ($scope, $stateParams, $location, Authentication, Configurations) {
    $scope.authentication = Authentication;

    // Create new Configuration
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'configurationForm');
        return false;
      }

      // Create new Configuration object
      var configuration = new Configurations({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      configuration.$save(function (response) {
        $location.path('configurations/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Configuration
    $scope.remove = function (configuration) {
      if (confirm('Are you sure you want to delete this configuration? This action cannot be undone.')) {
        if (configuration) {
          configuration.$remove();

          for (var i in $scope.configurations) {
            if ($scope.configurations[i] === configuration) {
              $scope.configurations.splice(i, 1);
            }
          }
        } else {
          $scope.configuration.$remove(function () {
            $location.path('configurations');
          });
        }
      }
    };

    // Update existing Configuration
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'configurationForm');
        return false;
      }

      var configuration = $scope.configuration;

      configuration.$update(function () {
        $location.path('configurations/' + configuration._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Configurations
    $scope.find = function () {
      $scope.configurations = Configurations.query();
    };

    // Find existing Configuration
    $scope.findOne = function () {
      $scope.configuration = Configurations.get({
        configurationId: $stateParams.configurationId
      });
    };
  }
]);
