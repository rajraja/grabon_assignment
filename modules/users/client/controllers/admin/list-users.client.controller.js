'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', 'constantsService', 'lodash', 'configurationSettingsService',
  function ($scope, $filter, Admin, constantsService, lodash, configurationSettingsService) {

    $scope.initLoadUsers = function () {
      // $scope.roles = constantsService.userRoles;
      configurationSettingsService.getConfigurationSettings()
        .then(function(response) {
                $scope.roles = response.systemRoles.list;
        },function (error) {
          console.log("Error in initLoadUsers().userRoles");
        });
      $scope.urlParams = {
          userEmail: "",
          userName: "",
          userRoles: ""
      };
    };

    $scope.callSearch = function(user_email, user_name) {
        $scope.urlParams.userEmail = user_email;
        $scope.urlParams.userName = user_name;
    };

    //Helper - called on change of roles
    $scope.updateRoles = function(selectRoles) {
        var user_roles = [];
        lodash.forEach(selectRoles, function(thisSelectRole) {
            user_roles.push(thisSelectRole.key);
        });
        $scope.urlParams.userRoles = user_roles.join(",");
    };

    // Admin.query(function (data) {
    //   $scope.users = data;
    //   $scope.buildPager();
    // });
    //
    // $scope.buildPager = function () {
    //   $scope.pagedItems = [];
    //   $scope.itemsPerPage = 15;
    //   $scope.currentPage = 1;
    //   $scope.figureOutItemsToDisplay();
    // };
    //
    // $scope.figureOutItemsToDisplay = function () {
    //   $scope.filteredItems = $filter('filter')($scope.users, {
    //     $: $scope.search
    //   });
    //   $scope.filterLength = $scope.filteredItems.length;
    //   var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
    //   var end = begin + $scope.itemsPerPage;
    //   $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    // };
    //
    // $scope.pageChanged = function () {
    //   $scope.figureOutItemsToDisplay();
    // };
  }
]);
