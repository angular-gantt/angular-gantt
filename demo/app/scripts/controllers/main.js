'use strict';

/**
 * @ngdoc function
 * @name angularGanttDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularGanttDemoApp
 */
angular.module('angularGanttDemoApp')
    .controller('MainCtrl', function($scope, $timeout, Uuid, Sample, GANTT_EVENTS) {
        $scope.options = {
            mode: 'custom',
            scale: 'day',
            maxHeight: false,
            width: false,
            autoExpand: 'none',
            taskOutOfRange: 'expand',
            fromDate: null,
            toDate: null,
            showWeekends: true,
            showNonWorkHours: true,
            currentDate: 'line',
            draw: false,
            readOnly: false,
            filterTask: undefined,
            filterRow: undefined
        };

        $scope.$watch('fromDate+toDate', function() {
            $scope.options.fromDate = $scope.fromDate;
            $scope.options.toDate = $scope.toDate;
        });

        // Get today date for currentDate indicator
        $scope.currentDate = new Date(2013, 9, 23, 11, 20, 0);

        $scope.ganttInitialized = function() {
            $scope.addSamples();
        };

        $scope.addSamples = function() {
            $scope.loadTimespans(Sample.getSampleTimespans().timespan1);
            $scope.loadData(Sample.getSampleData().data1);
            $timeout(function() {
                $scope.scrollToDate($scope.currentDate);
            }, 0, true);
        };

        $scope.removeSomeSamples = function() {
            $scope.removeData([
                {'id': 'c65c2672-445d-4297-a7f2-30de241b3145'}, // Remove all Kickoff meetings
                {'id': '2f85dbeb-0845-404e-934e-218bf39750c0', 'tasks': [
                    {'id': 'f55549b5-e449-4b0c-9f4b-8b33381f7d76'},
                    {'id': '5e997eb3-4311-46b1-a1b4-7e8663ea8b0b'},
                    {'id': '6fdfd775-7b22-42ec-a12c-21a64c9e7a9e'}
                ]}, // Remove some Milestones
                {'id': 'cfb29cd5-1737-4027-9778-bb3058fbed9c', 'tasks': [
                    {'id': '57638ba3-dfff-476d-ab9a-30fda1e44b50'}
                ]} // Remove order basket from Sprint 2
            ]);
        };

        $scope.removeSamples = function() {
            $scope.clearData();
        };

        $scope.columnDateEvent = function(event) {
            console.log('Column event (column.date: ' + event.column.date + ')');
        };

        $scope.labelEvent = function(event) {
            // A label has been clicked.
            console.log('Label event (by user: ' + event.userTriggered + '): ' + event.row.name + ' (Custom data: ' + event.row.data + ')');
        };

        $scope.labelHeaderEvent = function(event) {
            // The label header has been clicked.
            console.log('Label header event. Mouse: ' + event.evt.clientX + '/' + event.evt.clientY);
        };

        $scope.rowEvent = function(event) {
            // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
            console.log('Row event (by user: ' + event.userTriggered + '): ' + event.date + ' ' + event.row.name + ' (Custom data: ' + event.row.data + ')');

            if (!$scope.options.readOnly && $scope.options.draw) {
                // Example to draw task inside row
                if (event.userTriggered && event.evt.type === 'mousedown' && (event.evt.target ? event.evt.target : event.evt.srcElement).className.indexOf('gantt-row') > -1) {
                    var startDate = event.date;
                    var endDate = new Date(startDate.getTime());
                    //endDate.setDate(endDate.getDate());
                    var infoTask = {
                        id: Uuid.randomUuid(),  // Unique id of the task.
                        name: 'Test', // Name shown on top of each task.
                        from: startDate, // Date can be a String, Timestamp or Date object.
                        to: endDate,// Date can be a String, Timestamp or Date object.
                        color: '#AA8833', // Color of the task in HEX format (Optional).
                        data: {info: 'La Cacca sulla torretta'} // Custom object. Use this to attach your own data (Optional).

                    };
                    var task = event.row.addTask(infoTask);
                    task.isCreating = true;
                    task.updatePosAndSize();
                }
            }
        };

        $scope.scrollEvent = function(event) {
            if (angular.equals(event.direction, 'left')) {
                // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
                console.log('Scroll event: Left');
            } else if (angular.equals(event.direction, 'right')) {
                // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
                console.log('Scroll event: Right');
            }
        };

        var logTaskEvent = function(event, data) {
            // A task event has occured.
            var output = '';
            for (var property in data) {
                var propertyValue = data[property];
                if (property === 'evt') {
                    propertyValue = propertyValue.type;
                } else if (property === 'element' && propertyValue.length > 0) {
                    propertyValue = propertyValue[0].localName + (propertyValue[0].className ? '.' + propertyValue[0].className : '');
                } else if (property === 'task') {
                    propertyValue = propertyValue.name;
                } else if (property === 'column') {
                    propertyValue = propertyValue.date + '-' + propertyValue.getEndDate();
                }
                output += property + ': ' + propertyValue +'; ';
            }
            console.log('$scope.$on: ' + event.name + ': ' + output);
        };

        $scope.$on(GANTT_EVENTS.TASK_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_DBL_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_CONTEXTMENU, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_UPDATED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_MOVE_BEGIN, logTaskEvent);
        //$scope.$on(GANTT_EVENTS.TASK_MOVE, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_MOVE_END, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_RESIZE_BEGIN, logTaskEvent);
        //$scope.$on(GANTT_EVENTS.TASK_RESIZE, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_RESIZE_END, logTaskEvent);
    });
