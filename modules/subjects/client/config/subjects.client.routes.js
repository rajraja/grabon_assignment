'use strict';

// Setting up route
angular.module('subjects').config(['$stateProvider',
  function ($stateProvider) {
    // Subjects state routing
    $stateProvider
      .state('subjects', {
        abstract: true,
        url: '/subjects',
        template: '<ui-view/>'
      })
      .state('subjects.list', {
        url: '',
        templateUrl: 'modules/subjects/client/views/list-subjects.client.view.html'
      })
      .state('subjects.create', {
        url: '/create',
        templateUrl: 'modules/subjects/client/views/create-subject.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      // only for admin
      .state('subjects.add', {
        url: '/add/:userId',
        templateUrl: 'modules/subjects/client/views/admin/create-subject.client.view.html',
        data: {
          roles: ['admin']
        }
      })

      .state('subjects.view', {
        url: '/:subjectId',
        templateUrl: 'modules/subjects/client/views/view-subject.client.view.html'
      })
      .state('subjects.edit', {
        url: '/:subjectId/edit',
        templateUrl: 'modules/subjects/client/views/edit-subject.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
