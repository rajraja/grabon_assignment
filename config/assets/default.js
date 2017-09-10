'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // default bootstrap css needs to be comments
        // 'public/lib/bootstrap/dist/css/bootstrap.css',
        // 'public/lib/bootstrap/dist/css/bootstrap-theme.css',

        // adminLte css
        'public/lib/AdminLTE/bootstrap/css/bootstrap.min.css',
        'public/lib/AdminLTE/dist/css/AdminLTE.min.css',
        'public/lib/AdminLTE/dist/css/skins/_all-skins.min.css',
        'public/lib/AdminLTE/plugins/iCheck/flat/blue.css',
        'public/lib/AdminLTE/plugins/morris/morris.css',
        'public/lib/AdminLTE/plugins/jvectormap/jquery-jvectormap-1.2.2.css',
        'public/lib/AdminLTE/plugins/datepicker/datepicker3.css',
        'public/lib/AdminLTE/plugins/daterangepicker/daterangepicker.css',
        'public/lib/AdminLTE/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/Ionicons/css/ionicons.css',
        // ends adminLte css

        // bower css
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/angular-ui-select/dist/select.css',
        'public/lib/select2/select2.css',

        // my_custom css
        'modules/core/client/css/custom-style-sass.css',
        'modules/core/client/css/custom-style.css',
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',

        // adminLte js
        'public/lib/AdminLTE/plugins/jQuery/jquery-2.2.3.min.js',
        'public/lib/AdminLTE/bootstrap/js/bootstrap.min.js',
        'public/lib/AdminLTE/plugins/morris/morris.min.js',
        'public/lib/AdminLTE/plugins/sparkline/jquery.sparkline.min.js',
        'public/lib/AdminLTE/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
        'public/lib/AdminLTE/plugins/jvectormap/jquery-jvectormap-world-mill-en.js',
        'public/lib/AdminLTE/plugins/knob/jquery.knob.js',
        'public/lib/AdminLTE/plugins/daterangepicker/moment.js',
        'public/lib/AdminLTE/plugins/daterangepicker/daterangepicker.js',
        'public/lib/AdminLTE/plugins/datepicker/bootstrap-datepicker.js',
        'public/lib/AdminLTE/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js',
        'public/lib/AdminLTE/plugins/slimScroll/jquery.slimscroll.min.js',
        'public/lib/AdminLTE/plugins/fastclick/fastclick.js',
        'public/lib/AdminLTE/plugins/jQueryUI/jquery-ui.js',
        // ends adminLte js

        // paginateAnything
        'public/lib/angular-paginate-anything/dist/paginate-anything-tpls.js',
        // bower js
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/ng-lodash/build/ng-lodash.js',
        'public/lib/angular-ui-select/dist/select.js',
        'public/lib/angular-sanitize/angular-sanitize.js',

      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
