'use strict';

//Subjects service used for communicating with the subjects REST endpoints
angular.module('subjects').factory('Subjects', ['$resource',
  function ($resource) {
    return $resource('api/subjects/:subjectId', {
      subjectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getUserByUserId: {
        url: '/api/subjectsResource/getUserByUserId',
        method: 'POST',
        isArray: false
      },
      getSubjectListByUserId: {
        url: '/api/subjectsResource/getSubjectListByUserId',
        method: 'POST',
        isArray: true
      },
      addSubjectByAdmin: {
        url: '/api/subjectsResource/addSubjectByAdmin',
        method: 'POST',
        isArray: false
      }

    });
  }
]);
