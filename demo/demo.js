"use strict";

var demoApp = angular.module('demoApp', ['gantt', 'ngAnimate', 'mgcrea.ngStrap']);

demoApp.controller("ctrl", ['$scope', '$timeout', function($scope, $timeout) {
    $scope.options = {
        mode: "custom",
        scale: "day",
        maxHeight: false,
        width: false,
        showWeekends: true,
        showNonWorkHours: true,
        currentDate: "line"
    };

    // Get today date for currentDate indicator
    $scope.currentDate = new Date(2013,9,23,11,20,0);

    $scope.ganttInitialized = function() {
        $scope.addSamples();
    };

    $scope.addSamples = function () {
        $scope.loadTimespans(getSampleTimespans().timespan1);
        $scope.loadData(getSampleData().data1);
        $timeout(function() {
            $scope.scrollToDate($scope.currentDate);
        },0,true);
    };

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
    };

    $scope.removeSamples = function () {
        $scope.clearData();
    };

    $scope.columnDateEvent = function(event) {
        console.log('Column event (column.date: ' + event.column.date + ')');
    }

    $scope.labelEvent = function(event) {
        // A label has been clicked.
        console.log('Label event (by user: ' + event.userTriggered + '): ' + event.row.description + ' (Custom data: ' + event.row.data + ')');
    };

    $scope.labelHeaderEvent = function(event) {
        // The label header has been clicked.
        console.log('Label header event. Mouse: ' + event.evt.clientX + '/' + event.evt.clientY);
    };

    $scope.rowEvent = function(event) {
        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
        console.log('Row event (by user: ' + event.userTriggered + '): ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
        // Example to draw task inside row
         if(event.userTriggered && event.evt.type == "mousedown" && event.evt.srcElement.className.indexOf('gantt-row') > -1)
            {
                var startDate = event.date;
                var endDate = new Date(startDate.getTime());
                //endDate.setDate(endDate.getDate());
                var infoTask =   {
                    id: (Math.floor((Math.random() * 1000) + 1)),  // Unique id of the task.
                    subject: "Test", // Subject shown on top of each task.
                    from: startDate, // Date can be a String, Timestamp or Date object.
                    to: endDate,// Date can be a String, Timestamp or Date object.
                    color: "#AA8833" , // Color of the task in HEX format (Optional).
                    data: {info: "La Cacca sulla torretta"} // Custom object. Use this to attach your own data (Optional).
                    
                };
                var task = event.row.addTask(infoTask);
                task.isCreating = true;
                task.updatePosAndSize();
            }
    };

    $scope.scrollEvent = function(event) {
        if (angular.equals(event.direction, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
            console.log('Scroll event: Left');
        } else if (angular.equals(event.direction, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
            console.log('Scroll event: Right');
        }
    };

    $scope.taskEvent = function(event) {
        // A task has been updated or clicked.
        console.log('Task event (by user: ' + event.userTriggered + '): ' + event.task.subject + ' (Custom data: ' + event.task.data + ')');
    };

}]);
