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
    'gantt.sortable',
    'gantt.movable',
    'gantt.tooltips',
    'gantt.bounds',
    'gantt.progress',
    'mgcrea.ngStrap' // handle bootstrap properly in angularJS applications.
]).config(['$compileProvider', function(/*$compileProvider*/) {
    // Wait angular.js#9515 fix to disable debug info.
    // https://github.com/angular/angular.js/issues/9515
    //$compileProvider.debugInfoEnabled(false); // Remove debug info (angularJS >= 1.3)
}]);

'use strict';

/**
 * @ngdoc function
 * @name angularGanttDemoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularGanttDemoApp
 */
angular.module('angularGanttDemoApp')
    .controller('MainCtrl', ['$scope', '$timeout', '$log', 'ganttUtils', 'GanttObjectModel', 'Sample', 'ganttMouseOffset', 'ganttDebounce', 'moment', function($scope, $timeout, $log, utils, ObjectModel, Sample, mouseOffset, debounce, moment) {
        var objectModel;
        var data;
        var timespans;
        var originalData;

        $scope.options = {
            mode: 'custom',
            scale: 'day',
            sortMode: undefined,
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
            filterTask: '',
            filterRow: '',
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
                    api.rows.on.move($scope, addEventName('rows.on.move', logRowEvent));
                    api.rows.on.remove($scope, addEventName('rows.on.remove', logRowEvent));

                    api.labels.on.resize($scope, addEventName('labels.on.resize', logLabelsEvent));

                    api.timespans.on.add($scope, addEventName('timespans.on.add', logTimespanEvent));
                    api.columns.on.generate($scope, logColumnsGenerateEvent);

                    api.rows.on.filter($scope, logRowsFilterEvent);
                    api.tasks.on.filter($scope, logTasksFilterEvent);

                    // When gantt is ready, load data.
                    // `data` attribute could have been used too.
                    $scope.load();

                    api.directives.on.new($scope, function(directiveName, directiveScope, element) {
                        if (directiveName === 'ganttTask') {
                            element.bind('click', function(event) {
                                event.stopPropagation();
                                logTaskEvent('task-click', directiveScope.task);
                            });
                        } else if (directiveName === 'ganttRow') {
                            element.bind('click', function() {
                                logRowEvent('row-click', directiveScope.row);
                            });
                        }
                    });

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
                                            id: utils.randomUuid(),  // Unique id of the task.
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

                    objectModel = new ObjectModel(api);
                });
            }
        };

        // Reload data action
        $scope.load = function() {
            data = Sample.getSampleData();
            timespans = Sample.getSampleTimespans();

            $scope.api.timespans.load(timespans);
            $scope.api.data.load(data);

            originalData = angular.copy(data);

            $scope.live.task = data[3].tasks[0];
            $scope.live.row = data[0];
        };

        $scope.reload = function() {
            $scope.api.timespans.clear();
            $scope.api.data.clear();

            $scope.load();
        };

        // Remove data action
        $scope.remove = function() {
            $scope.api.data.remove([
                {'id': originalData[2].id}, // Remove Kickoff row
                {
                    'id': originalData[0].id, 'tasks': [
                    {'id': originalData[0].tasks[0].id},
                    {'id': originalData[0].tasks[3].id}
                ]
                }, // Remove some Milestones
                {
                    'id': originalData[6].id, 'tasks': [
                    {'id': originalData[6].tasks[0].id}
                ]
                } // Remove order basket from Sprint 2
            ]);
        };

        // Clear data action
        $scope.clear = function() {
            $scope.api.data.clear();
        };

        $scope.live = {};

        var debounceValue = 1000;

        $scope.$watch('live.taskJson', debounce(function(taskJson) {
            if (taskJson !== undefined) {
                var task = angular.fromJson(taskJson);
                objectModel.cleanTask(task);
                angular.extend($scope.live.task, task);
            }
        }, debounceValue));

        $scope.$watch('live.rowJson', debounce(function(rowJson) {
            if (rowJson !== undefined) {
                var row = angular.fromJson(rowJson);
                objectModel.cleanRow(row);
                var tasks = row.tasks;

                delete row.tasks;
                angular.extend($scope.live.row, row);

                var newTasks = {};
                var i, l;

                if (tasks !== undefined) {
                    for (i = 0, l = tasks.length; i < l; i++) {
                        objectModel.cleanTask(tasks[i]);
                    }

                    for (i = 0, l = tasks.length; i < l; i++) {
                        newTasks[tasks[i].id] = tasks[i];
                    }

                    if ($scope.live.row.tasks === undefined) {
                        $scope.live.row.tasks = [];
                    }
                    for (i = $scope.live.row.tasks.length-1; i >= 0; i--) {
                        var existingTask = $scope.live.row.tasks[i];
                        var newTask = newTasks[existingTask.id];
                        if (newTask === undefined) {
                            $scope.live.row.tasks.splice(i, 1);
                        } else {
                            objectModel.cleanTask(newTask);
                            angular.extend(existingTask, newTask);
                            delete newTasks[existingTask.id];
                        }
                    }
                } else {
                    delete $scope.live.row.tasks;
                }

                angular.forEach(newTasks, function(newTask) {
                    $scope.live.row.tasks.push(newTask);
                });
            }
        }, debounceValue));

        $scope.$watchCollection('live.task', debounce(function(task) {
            $scope.live.taskJson = angular.toJson(task, true);
        }, debounceValue));

        $scope.$watchCollection('live.row', debounce(function(row) {
            $scope.live.rowJson = angular.toJson(row, true);
        }, debounceValue));

        $scope.$watchCollection('live.row.tasks', debounce(function() {
            $scope.live.rowJson = angular.toJson($scope.live.row, true);
        }, debounceValue));

        // Event handler
        var logScrollEvent = function(left, date, direction) {
            if (date !== undefined) {
                $log.log('[Event] api.on.scroll: ' + left + ', ' + (date === undefined ? 'undefined' : date.format()) + ', ' + direction);
            }
        };

        // Event handler
        var logTaskEvent = function(eventName, task) {
            $log.log('[Event] ' + eventName + ': ' + task.model.name);
        };

        // Event handler
        var logRowEvent = function(eventName, row) {
            $log.log('[Event] ' + eventName + ': ' + row.model.name);
        };

        // Event handler
        var logTimespanEvent = function(eventName, timespan) {
            $log.log('[Event] ' + eventName + ': ' + timespan.model.name);
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

'use strict';

/**
 * @ngdoc service
 * @name angularGanttDemoApp.Sample
 * @description
 * # Sample
 * Service in the angularGanttDemoApp.
 */
angular.module('angularGanttDemoApp')
    .service('Sample', function Sample() {
        return {
            getSampleData: function() {
                return [
                        // Order is optional. If not specified it will be assigned automatically
                        {name: 'Milestones', height: '3em', sortable: {enabled: false}, classes: 'gantt-row-milestone', color: '#45607D', tasks: [
                            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
                            {name: 'Kickoff', color: '#93C47D', from: '2013-10-07T09:00:00', to: '2013-10-07T10:00:00', data: 'Can contain any custom data or object'},
                            {name: 'Concept approval', color: '#93C47D', from: new Date(2013, 9, 18, 18, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0), est: new Date(2013, 9, 16, 7, 0, 0), lct: new Date(2013, 9, 19, 0, 0, 0)},
                            {name: 'Development finished', color: '#93C47D', from: new Date(2013, 10, 15, 18, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
                            {name: 'Shop is running', color: '#93C47D', from: new Date(2013, 10, 22, 12, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)},
                            {name: 'Go-live', color: '#93C47D', from: new Date(2013, 10, 29, 16, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
                        ], data: 'Can contain any custom data or object'},
                        {name: 'Status meetings', tasks: [
                            {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0)},
                            {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0)},
                            {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0)},
                            {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
                            {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0)}
                        ]},
                        {name: 'Kickoff', movable: {allowResizing: false}, tasks: [
                            {name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
                                progress: {percent: 100, color: '#3C8CF8'}, movable: {enabled: false}},
                            {name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
                                progress: {percent: 100, color: '#3C8CF8'}},
                            {name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
                                progress: {percent: 100, color: '#3C8CF8'}}
                        ]},
                        {name: 'Create concept', tasks: [
                            {name: 'Create concept', color: '#F1C232', from: new Date(2013, 9, 10, 8, 0, 0), to: new Date(2013, 9, 16, 18, 0, 0), est: new Date(2013, 9, 8, 8, 0, 0), lct: new Date(2013, 9, 18, 20, 0, 0),
                                progress: 100}
                        ]},
                        {name: 'Finalize concept', tasks: [
                            {name: 'Finalize concept', color: '#F1C232', from: new Date(2013, 9, 17, 8, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0),
                                progress: 100}
                        ]},
                        {name: 'Sprint 1', tooltips: {enabled: false}, tasks: [
                            {name: 'Product list view', color: '#F1C232', from: new Date(2013, 9, 21, 8, 0, 0), to: new Date(2013, 9, 25, 15, 0, 0),
                                progress: 25}
                        ]},
                        {name: 'Sprint 2', tasks: [
                            {name: 'Order basket', color: '#F1C232', from: new Date(2013, 9, 28, 8, 0, 0), to: new Date(2013, 10, 1, 15, 0, 0)}
                        ]},
                        {name: 'Sprint 3', tasks: [
                            {name: 'Checkout', color: '#F1C232', from: new Date(2013, 10, 4, 8, 0, 0), to: new Date(2013, 10, 8, 15, 0, 0)}
                        ]},
                        {name: 'Sprint 4', tasks: [
                            {name: 'Login&Singup and admin view', color: '#F1C232', from: new Date(2013, 10, 11, 8, 0, 0), to: new Date(2013, 10, 15, 15, 0, 0)}
                        ]},
                        {name: 'Setup server', tasks: [
                            {name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0)}
                        ]},
                        {name: 'Config server', tasks: [
                            {name: 'SW / DNS/ Backups', color: '#F1C232', from: new Date(2013, 10, 18, 12, 0, 0), to: new Date(2013, 10, 21, 18, 0, 0)}
                        ]},
                        {name: 'Deployment', tasks: [
                            {name: 'Depl. & Final testing', color: '#F1C232', from: new Date(2013, 10, 21, 8, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)}
                        ]},
                        {name: 'Workshop', tasks: [
                            {name: 'On-side education', color: '#F1C232', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 25, 15, 0, 0)}
                        ]},
                        {name: 'Content', tasks: [
                            {name: 'Supervise content creation', color: '#F1C232', from: new Date(2013, 10, 26, 9, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
                        ]},
                        {name: 'Documentation', tasks: [
                            {name: 'Technical/User documentation', color: '#F1C232', from: new Date(2013, 10, 26, 8, 0, 0), to: new Date(2013, 10, 28, 18, 0, 0)}
                        ]}
                    ];
            },
            getSampleTimespans: function() {
                return [
                        {
                            from: new Date(2013, 9, 21, 8, 0, 0),
                            to: new Date(2013, 9, 25, 15, 0, 0),
                            name: 'Sprint 1 Timespan'
                            //priority: undefined,
                            //classes: [], //Set custom classes names to apply to the timespan.
                            //data: undefined
                        }
                    ];
            }
        };
    })
;
