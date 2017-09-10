'use strict';

// Configuring the Subjects module
angular.module('subjects').run(['Menus',
  function (Menus) {
    // Add the subjects dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Subjects',
      state: 'subjects',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'subjects', {
      title: 'My Subjects',
      state: 'subjects.list'
    });

    // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'subjects', {
    //   title: 'Create Subjects',
    //   state: 'subjects.create',
    //   roles: ['user']
    // });
  }
]);
