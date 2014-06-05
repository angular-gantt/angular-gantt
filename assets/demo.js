"use strict";

var demoApp = angular.module('demoApp', ['gantt', 'ngDragDrop']);

demoApp.controller("ctrl", ['$scope', '$filter', '$compile', function($scope, $filter, $compile) {
    $scope.mode = "custom";
    $scope.maxHeight = 0;
    $scope.showWeekends = true;
    $scope.showNonWorkHours = true;

    $scope.list1 = [];
    $scope.list2 = [
//        new TaskToDrag("Test", undefined, "Test", "pink", "", undefined, "2013-10-15T09:00:00", "2013-10-15T10:00:00", {value:"value"}),
//        new TaskToDrag("Test2", undefined, "Test", "pink", "", undefined, "2013-10-15T09:00:00", "2013-10-15T10:00:00", {value:"value"}),
//        new TaskToDrag("Test3", undefined, "Test", "pink", "", undefined, "2013-10-15T09:00:00", "2013-10-15T10:00:00", {value:"value"}),
//        new TaskToDrag("Test4", undefined, "Test", "pink", "", undefined, "2013-10-15T09:00:00", "2013-10-15T10:00:00", {value:"value"})

    ];

    $scope.jqyouiOptions = {
//        helper:function(a,b,c,d,e,f,g){
//            var scope = $scope.$new();
//            var defObj =angular.element(this).scope().item
//
//            scope.task = new TaskToDrag(defObj.id, undefined, defObj.subject, defObj.color, defObj.classes, defObj.priority, defObj.from, defObj.to, defObj.data);
//            console.log(scope);
//            var domElm =  $compile('<mygantt-task></mygantt-task>')(scope);
//            //var domElm = '<div style="background-color:red">TEST</div>';
//
//            console.log(domElm);
//            return domElm;
//        }
    }
    $scope.onStart = function(args1, args2, args3, args4){
        console.log('onStart');
        args1.data = this.item;
        args2.julien = this.item;
    };
    angular.forEach($scope.list2, function(val, key) {
        $scope.list1.push({});
    });

    $scope.addSamples = function () {
        $scope.loadData(getSampleData().data1);
    };

    $scope.onOver = function(){
        console.log('onOver');
    };

    $scope.onDrog= function(event, ui){
        console.log('onDrop')
    }

    $scope.onOut = function(){
        console.log('onOut');
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

    $scope.rowEvent = function(event) {
        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
        console.log('Row event (by user: ' + event.userTriggered + '): ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
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