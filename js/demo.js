"use strict";

var demoApp = angular.module('demoApp', ['gantt']);

demoApp.controller("ctrl", ['$scope', function($scope) {
    $scope.mode = "custom";
    $scope.firstDay = 1;
    $scope.weekendDays = [0,6];

    $scope.setLoadDataFn = function(fn) {
        $scope.loadData = fn;

        // Load data after Gantt has been initialized
        $scope.addSamples();
    };

    $scope.addSamples = function () {
        $scope.loadData(getSampleData().data1);
    }

    $scope.entryEvent = function(event) {
        // A entry has been added or updated. Use this event to save back the updated entry.
    }

    $scope.scroll = function(event) {
        if (angular.equals(event.position, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
        } else if (angular.equals(event.position, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
        }
    }
}]);