'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve', 'constantsService', 'lodash', 'configurationSettingsService',
  function ($scope, $state, Authentication, userResolve, constantsService, lodash, configurationSettingsService) {
    $scope.authentication = Authentication;
    // $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    // init view user
    $scope.initViewUsers = function () {
      $scope.user = userResolve;
    };

    // init edit user
    $scope.initEditUsers = function () {
      // $scope.user = userResolve;
      // $scope.roles = constantsService.userRoles;
      configurationSettingsService.getConfigurationSettings()
        .then(function(response) {
                $scope.roles = response.systemRoles.list;
        },function (error) {
          console.log("Error in initLoadUsers().userRoles");
        });
      userResolve.$promise.then(function(response) {
        $scope.user = response;
        var selectRoles = [];
        lodash.forEach($scope.user.roles, function(thisRole) {
            var temp = lodash.find($scope.roles, {key: thisRole});
            selectRoles.push(temp);
        });
        $scope.selectRoles = selectRoles;
        $scope.userRoles = $scope.user.roles;
      });

    };

    //Helper - called on change of roles
    $scope.updateRoles = function(selectRoles) {
        var user_roles = [];
        lodash.forEach(selectRoles, function(thisSelectRole) {
            user_roles.push(thisSelectRole.key);
        });
        $scope.userRoles = user_roles;
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      if (lodash.isEmpty($scope.userRoles)) { //At least 1 role should be selected
          return false;
      }
      $scope.user.roles = $scope.userRoles;

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
