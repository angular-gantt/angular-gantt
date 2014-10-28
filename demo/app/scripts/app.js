'use strict';

/**
 * @ngdoc overview
 * @name angularGanttDemoApp
 * @description
 * # angularGanttDemoApp
 *
 * Main module of the application.
 */
angular.module('angularGanttDemoApp', [
    'gantt', // angular-gantt.
    'mgcrea.ngStrap' // handle bootstrap properly in angularJS applications.
]).config(['$compileProvider', function($compileProvider) {
    $compileProvider.debugInfoEnabled(false); // Remove debug info (angularJS >= 1.3)
}]);
