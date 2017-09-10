'use strict';

// Setting up route
angular.module('configurations').config(['$stateProvider',
  function ($stateProvider) {
    // Configurations state routing
    $stateProvider
      .state('configurations', {
        abstract: true,
        url: '/configurations',
        template: '<ui-view/>'
      })
      .state('configurations.list', {
        url: '',
        templateUrl: 'modules/configurations/client/views/list-configurations.client.view.html'
      })
      .state('configurations.create', {
        url: '/create',
        templateUrl: 'modules/configurations/client/views/create-configuration.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('configurations.view', {
        url: '/:configurationId',
        templateUrl: 'modules/configurations/client/views/view-configuration.client.view.html'
      })
      .state('configurations.edit', {
        url: '/:configurationId/edit',
        templateUrl: 'modules/configurations/client/views/edit-configuration.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
