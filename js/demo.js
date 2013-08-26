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

    $scope.setRemoveDataFn = function(fn) {
        $scope.removeData = fn;
    };

    $scope.addSamples = function () {
        $scope.loadData(getSampleData().data1);
    }

    $scope.removeSomeSamples = function () {
        $scope.removeData([
            {"id": "c65c2672-445d-4297-a7f2-30de241b3145"}, // Remove all Kickoff meetings
            {"id": "2f85dbeb-0845-404e-934e-218bf39750c0", "tasks": [
                {"id": "f55549b5-e449-4b0c-9f4b-8b33381f7d76"},
                {"id": "5e997eb3-4311-46b1-a1b4-7e8663ea8b0b"},
                {"id": "6fdfd775-7b22-42ec-a12c-21a64c9e7a9e"}
            ]}, // Remove some Milestones
            {"id": "cfb29cd5-1737-4027-9778-bb3058fbed9c", "tasks": [
                {"id": "57638ba3-dfff-476d-ab9a-30fda1e44b50"}
            ]} // Remove order basket from Sprint 2
        ]);
    }

    $scope.rowEvent = function(event) {
        // A row has been added or updated. Use this event to save back the updated row.
    }

    $scope.scrollEvent = function(event) {
        if (angular.equals(event.position, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
        } else if (angular.equals(event.position, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
        }
    }
}]);