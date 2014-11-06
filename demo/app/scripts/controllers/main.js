'use strict';

/**
 * @ngdoc function
 * @name angularGanttDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularGanttDemoApp
 */
angular.module('angularGanttDemoApp')
    .controller('MainCtrl', ['$scope', '$timeout', '$log', 'Uuid', 'Sample', 'ganttMouseOffset', 'moment', function($scope, $timeout, $log, Uuid, Sample, mouseOffset, moment) {
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
            currentDateValue: new Date(2013, 9, 23, 11, 20, 0),
            draw: false,
            readOnly: false,
            filterTask: undefined,
            filterRow: undefined,
            timeFrames: {
                'day': {
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
                },
                'holiday': {
                    working: false,
                    color: 'red',
                    classes: ['gantt-timeframe-holiday']
                }
            },
            dateFrames: {
                'weekend': {
                    evaluator: function(date) {
                        return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                    },
                    targets: ['weekend']
                },
                '11-november': {
                    evaluator: function(date) {
                        return date.month() === 10 && date.date() === 11;
                    },
                    targets: ['holiday']
                }
            },
            timeFramesNonWorkingMode: 'visible',
            columnMagnet: '5 minutes',
            api: function(api) {
                // API Object is used to control methods and events from angular-gantt.
                $scope.api = api;

                api.core.on.ready($scope, function() {
                    // When gantt is ready, load data.
                    // `data` attribute could have been used too.
                    $scope.addSamples();

                    // Log various events to console
                    api.scroll.on.scroll($scope, logScrollEvent);
                    api.core.on.ready($scope, logReadyEvent);

                    api.tasks.on.add($scope, addEventName('tasks.on.add', logTaskEvent));
                    api.tasks.on.change($scope, addEventName('tasks.on.change', logTaskEvent));
                    api.tasks.on.remove($scope, addEventName('tasks.on.remove', logTaskEvent));

                    api.tasks.on.moveBegin($scope, addEventName('tasks.on.moveBegin', logTaskEvent));
                    //api.tasks.on.move($scope, addEventName('tasks.on.move', logTaskEvent));
                    api.tasks.on.moveEnd($scope, addEventName('tasks.on.moveEnd', logTaskEvent));

                    api.tasks.on.resizeBegin($scope, addEventName('tasks.on.resizeBegin', logTaskEvent));
                    //api.tasks.on.resize($scope, addEventName('tasks.on.resize', logTaskEvent));
                    api.tasks.on.resizeEnd($scope, addEventName('tasks.on.resizeEnd', logTaskEvent));

                    api.rows.on.add($scope, addEventName('rows.on.add', logRowEvent));
                    api.rows.on.change($scope, addEventName('rows.on.change', logRowEvent));
                    api.rows.on.orderChange($scope, addEventName('rows.on.orderChange', logRowEvent));
                    api.rows.on.remove($scope, addEventName('rows.on.remove', logRowEvent));

                    api.labels.on.resize($scope, addEventName('labels.on.resize', logLabelsEvent));

                    api.timespans.on.add($scope, addEventName('timespans.on.add', logTimespanEvent));
                    api.columns.on.generate($scope, logColumnsGenerateEvent);

                    api.rows.on.filter($scope, logRowsFilterEvent);
                    api.tasks.on.filter($scope, logTasksFilterEvent);

                    // Add draw support using API directives.on.new event.
                    api.directives.on.new($scope, function(directiveName, directiveScope, element) {
                        if (directiveName === 'ganttRow') {
                            // When gantt-row directive is added
                            var drawHandler = function(evt) {
                                if (!$scope.options.readOnly && $scope.options.draw) {
                                    // Example to draw task inside row

                                    if ((evt.target ? evt.target : evt.srcElement).className.indexOf('gantt-row') > -1) {
                                        var startDate = $scope.api.core.getDateByPosition(mouseOffset.getOffset(evt).x);
                                        var endDate = moment(startDate);
                                        //endDate.setDate(endDate.getDate());
                                        var infoTask = {
                                            id: Uuid.randomUuid(),  // Unique id of the task.
                                            name: 'Drawn task', // Name shown on top of each task.
                                            from: startDate, // Date can be a String, Timestamp or Date object.
                                            to: endDate,// Date can be a String, Timestamp or Date object.
                                            color: '#AA8833' // Color of the task in HEX format (Optional).
                                        };
                                        var task = directiveScope.row.addTask(infoTask);
                                        task.isCreating = true;
                                        directiveScope.$apply(function() {
                                            task.updatePosAndSize();
                                            directiveScope.row.updateVisibleTasks();
                                        });
                                    }
                                }
                            };

                            element.on('mousedown', drawHandler);
                            directiveScope.drawHandler = drawHandler;
                        }
                    });

                    // Remove draw support when row is removed from DOM.
                    api.directives.on.destroy($scope, function(directiveName, directiveScope, element) {
                        if (directiveName === 'ganttRow') {
                            element.off('mousedown', directiveScope.drawHandler);
                            delete directiveScope.drawHandler;
                        }
                    });
                });



            }
        };

        $scope.$watch('options.scale', function(newValue) {
            if (newValue === 'quarter') {
                $scope.options.headersFormats = {'quarter': '[Q]Q YYYY'};
                $scope.options.headers = ['quarter'];
            } else {
                $scope.options.headersFormats = undefined;
                $scope.options.headers = undefined;
            }
        });

        // Reload data action
        $scope.addSamples = function() {
            $scope.api.timespans.load(Sample.getSampleTimespans().timespan1);
            $scope.api.data.load(Sample.getSampleData().data1);
        };

        // Remove data action
        $scope.removeSomeSamples = function() {
            $scope.api.data.remove([
                {'id': 'c65c2672-445d-4297-a7f2-30de241b3145'}, // Remove all Kickoff meetings
                {
                    'id': '2f85dbeb-0845-404e-934e-218bf39750c0', 'tasks': [
                    {'id': 'f55549b5-e449-4b0c-9f4b-8b33381f7d76'},
                    {'id': '5e997eb3-4311-46b1-a1b4-7e8663ea8b0b'},
                    {'id': '6fdfd775-7b22-42ec-a12c-21a64c9e7a9e'}
                ]
                }, // Remove some Milestones
                {
                    'id': 'cfb29cd5-1737-4027-9778-bb3058fbed9c', 'tasks': [
                    {'id': '57638ba3-dfff-476d-ab9a-30fda1e44b50'}
                ]
                } // Remove order basket from Sprint 2
            ]);
        };

        // Clear data action
        $scope.removeSamples = function() {
            $scope.api.data.clear();
        };

        // Event handler
        var logScrollEvent = function(left, date, direction) {
            if (date !== undefined) {
                $log.log('[Event] api.on.scroll: ' + left + ', ' + (date === undefined ? 'undefined' : date.format()) + ', ' + direction);
            }
        };

        // Event handler
        var logTaskEvent = function(eventName, task) {
            $log.log('[Event] ' + eventName + ': ' + task.name);
        };

        // Event handler
        var logRowEvent = function(eventName, row) {
            $log.log('[Event] ' + eventName + ': ' + row.name);
        };

        // Event handler
        var logTimespanEvent = function(eventName, timespan) {
            $log.log('[Event] ' + eventName + ': ' + timespan.name);
        };

        // Event handler
        var logLabelsEvent = function(eventName, width) {
            $log.log('[Event] ' + eventName + ': ' + width);
        };

        // Event handler
        var logColumnsGenerateEvent = function(columns, headers) {
            $log.log('[Event] ' + 'columns.on.generate' + ': ' + columns.length + ' column(s), ' + headers.length + ' header(s)');
        };

        // Event handler
        var logRowsFilterEvent = function(rows, filteredRows) {
            $log.log('[Event] rows.on.filter: ' + filteredRows.length + '/' + rows.length + ' rows displayed.');
        };

        // Event handler
        var logTasksFilterEvent = function(tasks, filteredTasks) {
            $log.log('[Event] tasks.on.filter: ' + filteredTasks.length + '/' + tasks.length + ' tasks displayed.');
        };

        // Event handler
        var logReadyEvent = function() {
            $log.log('[Event] core.on.ready');
        };

        // Event utility function
        var addEventName = function(eventName, func) {
            return function(data) {
                return func(eventName, data);
            };
        };

    }]);
