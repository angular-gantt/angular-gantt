// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-09-22 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/es5-shim/es5-shim.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/json3/lib/json3.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-strap/dist/angular-strap.js',
      'bower_components/angular-strap/dist/angular-strap.tpl.js',
      'bower_components/angular-native-dragdrop/draganddrop.js',
      'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-gantt/assets/angular-gantt.js',
      'bower_components/angular-gantt/assets/angular-gantt-plugins.js',
      'bower_components/moment-range/lib/moment-range.js',
      'bower_components/css-element-queries/src/ElementQueries.js',
      'bower_components/css-element-queries/src/ResizeSensor.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
