'use strict';

/**
 * @ngdoc function
 * @name angularGanttDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularGanttDemoApp
 */
angular.module('angularGanttDemoApp')
    .controller('MainCtrl', function($scope, $timeout, Uuid, Sample, moment, GANTT_EVENTS) {
        $scope.options = {
            mode: 'custom',
            scale: 'day',
            maxHeight: false,
            width: false,
            autoExpand: 'none',
            taskOutOfRange: 'truncate',
            fromDate: undefined,
            toDate: undefined,
            showLabelsColumn: true,
            currentDate: 'line',
            currentDateValue : new Date(2013, 9, 23, 11, 20, 0),
            draw: false,
            readOnly: false,
            filterTask: undefined,
            filterRow: undefined,
            timeFrames:
                 {'day': {
                    start: moment('8:00', 'HH:mm'),
                        end: moment('20:00', 'HH:mm'),
                        working: true,
                        default: true
                    },
                 'noon': {
                     start: moment('12:00', 'HH:mm'),
                     end: moment('13:30', 'HH:mm'),
                     working: false,
                     default: true
                 },
                 'weekend': {
                     working: false
                 }
                },
            dateFrames: {
                'weekend': {
                    evaluator: function(date) {
                        return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                    },
                    targets: ['weekend']
                }
            },
            timeFramesNonWorkingMode: 'visible',
            columnMagnet: '5 minutes'
        };

        $scope.$watch('fromDate+toDate', function() {
            $scope.options.fromDate = $scope.fromDate;
            $scope.options.toDate = $scope.toDate;
        });

        $scope.$on(GANTT_EVENTS.READY, function() {
            $scope.addSamples();
            $timeout(function() {
                $scope.scrollToDate($scope.options.currentDateValue);
            }, 0, true);
        });

        $scope.addSamples = function() {
            //$scope.loadTimespans(Sample.getSampleTimespans().timespan1);
            $scope.loadData(Sample.getSampleData().data1);
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

        var logScrollEvent = function(event, data) {
            if (angular.equals(data.direction, 'left')) {
                // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
                console.log('Scroll event: Left ' + data.left);
            } else if (angular.equals(data.direction, 'right')) {
                // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
                console.log('Scroll event: Right');
            }
        };

        var logTaskEvent = function(event, data) {
            // A task event has occured.
            var output = '';
            for (var property in data) {
                var propertyValue = data[property];
                if (property === 'evt' && propertyValue) {
                    propertyValue = propertyValue.type;
                } else if (property === 'element' && propertyValue.length > 0) {
                    propertyValue = propertyValue[0].localName + (propertyValue[0].className ? '.' + propertyValue[0].className : '');
                } else if (property === 'task') {
                    propertyValue = propertyValue.name;
                } else if (property === 'timespan') {
                    propertyValue = propertyValue.name;
                } else if (property === 'column') {
                    propertyValue = propertyValue.date.format() + ' <---> ' + propertyValue.endDate.format();
                }  else if (property === 'row') {
                    propertyValue = propertyValue.name;
                } else if (property === 'date') {
                    propertyValue = propertyValue.format();
                }
                output += property + ': ' + propertyValue +'; ';
            }
            console.log('$scope.$on: ' + event.name + ': ' + output);
        };

        $scope.$on(GANTT_EVENTS.TASK_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_DBL_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_CONTEXTMENU, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_CHANGED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_MOVE_BEGIN, logTaskEvent);
        //$scope.$on(GANTT_EVENTS.TASK_MOVE, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_MOVE_END, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_RESIZE_BEGIN, logTaskEvent);
        //$scope.$on(GANTT_EVENTS.TASK_RESIZE, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TASK_RESIZE_END, logTaskEvent);

        $scope.$on(GANTT_EVENTS.COLUMN_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.COLUMN_DBL_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.COLUMN_CONTEXTMENU, logTaskEvent);

        $scope.$on(GANTT_EVENTS.ROW_MOUSEDOWN, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_MOUSEUP, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_DBL_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_CONTEXTMENU, logTaskEvent);

        $scope.$on(GANTT_EVENTS.ROW_ORDER_CHANGED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_CHANGED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_ADDED, logTaskEvent);

        var rowEvent = function(event, data) {
            if (!$scope.options.readOnly && $scope.options.draw) {
                // Example to draw task inside row
                if ((data.evt.target ? data.evt.target : data.evt.srcElement).className.indexOf('gantt-row') > -1) {
                    var startDate = data.date;
                    var endDate = moment(startDate);
                    //endDate.setDate(endDate.getDate());
                    var infoTask = {
                        id: Uuid.randomUuid(),  // Unique id of the task.
                        name: 'Drawn task', // Name shown on top of each task.
                        from: startDate, // Date can be a String, Timestamp or Date object.
                        to: endDate,// Date can be a String, Timestamp or Date object.
                        color: '#AA8833' // Color of the task in HEX format (Optional).
                    };
                    var task = data.row.addTask(infoTask);
                    task.isCreating = true;
                    task.updatePosAndSize();
                }
            }
        };

        $scope.$on(GANTT_EVENTS.ROW_MOUSEDOWN, rowEvent);

        $scope.$on(GANTT_EVENTS.ROW_LABEL_MOUSEDOWN, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_LABEL_MOUSEUP, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_LABEL_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_LABEL_DBL_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_LABEL_CONTEXTMENU, logTaskEvent);

        $scope.$on(GANTT_EVENTS.ROW_HEADER_MOUSEDOWN, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_HEADER_MOUSEUP, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_HEADER_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_HEADER_DBL_CLICKED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.ROW_HEADER_CONTEXTMENU, logTaskEvent);

        $scope.$on(GANTT_EVENTS.ROW_LABELS_RESIZED, logTaskEvent);

        $scope.$on(GANTT_EVENTS.TIMESPAN_ADDED, logTaskEvent);
        $scope.$on(GANTT_EVENTS.TIMESPAN_CHANGED, logTaskEvent);

        $scope.$on(GANTT_EVENTS.READY, logTaskEvent);
        $scope.$on(GANTT_EVENTS.SCROLL, logScrollEvent);
    });
