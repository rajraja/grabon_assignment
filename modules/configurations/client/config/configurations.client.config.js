'use strict';

// Configuring the Configurations module
angular.module('configurations').run(['Menus',
  function (Menus) {
    // Add the configurations dropdown item
    // Menus.addMenuItem('topbar', {
    //   title: 'Configurations',
    //   state: 'configurations',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    //
    // // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'configurations', {
    //   title: 'List Configurations',
    //   state: 'configurations.list'
    // });
    //
    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'configurations', {
    //   title: 'Create Configurations',
    //   state: 'configurations.create',
    //   roles: ['user']
    // });
  }
]);
