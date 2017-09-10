'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$location', '$window',
  function ($scope, $state, Authentication, Menus, $location, $window) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    // for user roles redirection if user refrech the page
    $scope.homeInit = function () {
      // If user is signed in then redirect back home
      if ($scope.authentication.user) {
        var pathname = $window.location.pathname;
        if(pathname === '/'){
          //$location.path('/');
          //re-direct to dashboard
          var roles = $scope.authentication.user.roles;
          if(roles.length == 1 && roles[0] == 'user'){
            //If user has only user role, send to user dashboard
                $state.go('userDashboard');
          }
          else if(roles.length == 1 && roles[0] == 'admin'){
              //If user has only user role, send to admin dashboard
                // $state.go('/admin.users');
                $location.path('/admin/users');
          }
          else{
              $state.go('userDashboard');
          }
        }

      }
      else{
        $location.path('/');
      }
    };

  }
]);
