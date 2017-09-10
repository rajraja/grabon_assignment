'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, Notification) {
    $scope.authentication = Authentication;
    // $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.popoverMsg = 'Password should be longer than 6 character!';
    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
        // And redirect to the previous or home page
        // $state.go($state.previous.state.name || 'home', $state.previous.params);
        var landingUrl = "http://" + $window.location.host + "/userDashboard";
        $window.location.href = landingUrl;
        
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        Notification.info({ message: 'Welcome ' + response.firstName });

        // And redirect to the previous or home page
        // $state.go($state.previous.state.name || 'home', $state.previous.params);

        var roles = $scope.authentication.user.roles;
        if(roles.length === 1 && roles[0] === 'user'){
          //If user has only user role, send to user dashboard
            var landingUrl = "http://" + $window.location.host + "/userDashboard";
            $window.location.href = landingUrl;
        }
        else if(roles.length === 1 && roles[0] === 'admin'){
            //If user has only user role, send to admin dashboard
              var landingUrl = "http://" + $window.location.host + "/admin/users";
              $window.location.href = landingUrl;
        }
        else{
          var landingUrl = "http://" + $window.location.host + "/userDashboard";
          $window.location.href = landingUrl;

        }

      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
