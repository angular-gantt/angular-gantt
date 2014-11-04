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
                });

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
            $log.log('[Event] ' + 'columns.on.generate' + ': ' + columns + ', ' + headers);
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
 * @name angularGanttDemoApp.Uuid
 * @description
 * # Uuid
 * Service in the angularGanttDemoApp.
 */
angular.module('angularGanttDemoApp')
    .service('Uuid', function Uuid() {
        return {
            s4: function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            },
            randomUuid: function() {
                return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                    this.s4() + '-' + this.s4() + this.s4() + this.s4();
            }
        };
    });

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
                return {
                    'data1': [
                        // Order is optional. If not specified it will be assigned automatically
                        {'id': '2f85dbeb-0845-404e-934e-218bf39750c0', 'name': 'Milestones', 'order': 0, 'height': '3em', classes: 'gantt-row-milestone', 'color': '#45607D', 'tasks': [
                            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
                            {'id': 'f55549b5-e449-4b0c-9f4b-8b33381f7d76', 'name': 'Kickoff', 'color': '#93C47D', 'from': '2013-10-07T09:00:00', 'to': '2013-10-07T10:00:00', 'data': 'Can contain any custom data or object'},
                            {'id': '5e997eb3-4311-46b1-a1b4-7e8663ea8b0b', 'name': 'Concept approval', 'color': '#93C47D', 'from': new Date(2013, 9, 18, 18, 0, 0), 'to': new Date(2013, 9, 18, 18, 0, 0), 'est': new Date(2013, 9, 16, 7, 0, 0), 'lct': new Date(2013, 9, 19, 0, 0, 0)},
                            {'id': 'b6a1c25c-85ae-4991-8502-b2b5127bc47c', 'name': 'Development finished', 'color': '#93C47D', 'from': new Date(2013, 10, 15, 18, 0, 0), 'to': new Date(2013, 10, 15, 18, 0, 0)},
                            {'id': '6fdfd775-7b22-42ec-a12c-21a64c9e7a9e', 'name': 'Shop is running', 'color': '#93C47D', 'from': new Date(2013, 10, 22, 12, 0, 0), 'to': new Date(2013, 10, 22, 12, 0, 0)},
                            {'id': 'c112ee80-82fc-49ba-b8de-f8efba41b5b4', 'name': 'Go-live', 'color': '#93C47D', 'from': new Date(2013, 10, 29, 16, 0, 0), 'to': new Date(2013, 10, 29, 16, 0, 0)}
                        ], 'data': 'Can contain any custom data or object'},
                        {'id': 'b8d10927-cf50-48bd-a056-3554decab824', 'name': 'Status meetings', 'order': 1, 'tasks': [
                            {'id': '301d781f-1ef0-4c35-8398-478b641c0658', 'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 9, 25, 15, 0, 0), 'to': new Date(2013, 9, 25, 18, 30, 0)},
                            {'id': '0fbf344a-cb43-4b20-8003-a789ba803ad8', 'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 1, 15, 0, 0), 'to': new Date(2013, 10, 1, 18, 0, 0)},
                            {'id': '12af138c-ba21-4159-99b9-06d61b1299a2', 'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 8, 15, 0, 0), 'to': new Date(2013, 10, 8, 18, 0, 0)},
                            {'id': '73294eca-de4c-4f35-aa9b-ae25480967ba', 'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 15, 15, 0, 0), 'to': new Date(2013, 10, 15, 18, 0, 0)},
                            {'id': '75c3dc51-09c4-44fb-ac40-2f4548d0728e', 'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 24, 9, 0, 0), 'to': new Date(2013, 10, 24, 10, 0, 0)}
                        ]},
                        {'id': 'c65c2672-445d-4297-a7f2-30de241b3145', 'name': 'Kickoff', 'order': 2, 'tasks': [
                            {'id': '4e197e4d-02a4-490e-b920-4881c3ba8eb7', 'name': 'Day 1', 'color': '#9FC5F8', 'from': new Date(2013, 9, 7, 9, 0, 0), 'to': new Date(2013, 9, 7, 17, 0, 0),
                                'progress': {'percent': 100, 'color': '#3C8CF8'}},
                            {'id': '451046c0-9b17-4eaf-aee0-4e17fcfce6ae', 'name': 'Day 2', 'color': '#9FC5F8', 'from': new Date(2013, 9, 8, 9, 0, 0), 'to': new Date(2013, 9, 8, 17, 0, 0),
                                'progress': {'percent': 100, 'color': '#3C8CF8'}},
                            {'id': 'fcc568c5-53b0-4046-8f19-265ebab34c0b', 'name': 'Day 3', 'color': '#9FC5F8', 'from': new Date(2013, 9, 9, 8, 30, 0), 'to': new Date(2013, 9, 9, 12, 0, 0),
                                'progress': {'percent': 100, 'color': '#3C8CF8'}}
                        ]},
                        {'id': 'dd2e7a97-1622-4521-a807-f29960218785', 'name': 'Create concept', 'order': 3, 'tasks': [
                            {'id': '9c17a6c8-ce8c-4426-8693-a0965ff0fe69', 'name': 'Create concept', 'color': '#F1C232', 'from': new Date(2013, 9, 10, 8, 0, 0), 'to': new Date(2013, 9, 16, 18, 0, 0), 'est': new Date(2013, 9, 8, 8, 0, 0), 'lct': new Date(2013, 9, 18, 20, 0, 0),
                                'progress': 100}
                        ]},
                        {'id': 'eede0c9a-6777-4b55-9359-1eada309404e', 'name': 'Finalize concept', 'order': 4, 'tasks': [
                            {'id': '30b8f544-5a45-4357-9a72-dd0181fba49f', 'name': 'Finalize concept', 'color': '#F1C232', 'from': new Date(2013, 9, 17, 8, 0, 0), 'to': new Date(2013, 9, 18, 18, 0, 0),
                                'progress': 100}
                        ]},
                        {'id': 'b5318fd9-5d70-4eb1-9c05-65647b9aefe6', 'name': 'Sprint 1', 'order': 5, 'tasks': [
                            {'id': 'd1fdf100-534c-4198-afb9-7bcaef0696f0', 'name': 'Product list view', 'color': '#F1C232', 'from': new Date(2013, 9, 21, 8, 0, 0), 'to': new Date(2013, 9, 25, 15, 0, 0),
                                'progress': 25}
                        ]},
                        {'id': 'cfb29cd5-1737-4027-9778-bb3058fbed9c', 'name': 'Sprint 2', 'order': 6, 'tasks': [
                            {'id': '57638ba3-dfff-476d-ab9a-30fda1e44b50', 'name': 'Order basket', 'color': '#F1C232', 'from': new Date(2013, 9, 28, 8, 0, 0), 'to': new Date(2013, 10, 1, 15, 0, 0)}
                        ]},
                        {'id': 'df9bb83f-e9de-4cbe-944e-36aec6db53cc', 'name': 'Sprint 3', 'order': 7, 'tasks': [
                            {'id': '192adc6e-ab17-4cd1-82d8-4a5e7525b169', 'name': 'Checkout', 'color': '#F1C232', 'from': new Date(2013, 10, 4, 8, 0, 0), 'to': new Date(2013, 10, 8, 15, 0, 0)}
                        ]},
                        {'id': '48cbc052-1fd5-4262-a05f-97dad7337876', 'name': 'Sprint 4', 'order': 8, 'tasks': [
                            {'id': '431dc7be-b61b-49a0-b26d-7ab5dfcadd41', 'name': 'Login&Singup and admin view', 'color': '#F1C232', 'from': new Date(2013, 10, 11, 8, 0, 0), 'to': new Date(2013, 10, 15, 15, 0, 0)}
                        ]},
                        {'id': '34473cc4-5ee5-4953-8289-98779172129e', 'name': 'Setup server', 'order': 9, 'tasks': [
                            {'id': '43eb6d19-6402-493c-a281-20e59a6fab6e', 'name': 'HW', 'color': '#F1C232', 'from': new Date(2013, 10, 18, 8, 0, 0), 'to': new Date(2013, 10, 18, 12, 0, 0)}
                        ]},
                        {'id': '73cae585-5b2c-46b6-aeaf-8cf728c894f7', 'name': 'Config server', 'order': 10, 'tasks': [
                            {'id': '8dbfda29-e775-4fa3-87c1-103b085d52ee', 'name': 'SW / DNS/ Backups', 'color': '#F1C232', 'from': new Date(2013, 10, 18, 12, 0, 0), 'to': new Date(2013, 10, 21, 18, 0, 0)}
                        ]},
                        {'id': '41cae585-ad2c-46b6-aeaf-8cf728c894f7', 'name': 'Deployment', 'order': 11, 'tasks': [
                            {'id': '2dbfda09-e775-4fa3-87c1-103b085d52ee', 'name': 'Depl. & Final testing', 'color': '#F1C232', 'from': new Date(2013, 10, 21, 8, 0, 0), 'to': new Date(2013, 10, 22, 12, 0, 0)}
                        ]},
                        {'id': '33e1af55-52c6-4ccd-b261-1f4484ed5773', 'name': 'Workshop', 'order': 12, 'tasks': [
                            {'id': '656b9240-00da-42ff-bfbd-dfe7ba393528', 'name': 'On-side education', 'color': '#F1C232', 'from': new Date(2013, 10, 24, 9, 0, 0), 'to': new Date(2013, 10, 25, 15, 0, 0)}
                        ]},
                        {'id': 'bffa16c6-c134-4443-8e6e-b09410c37c9f', 'name': 'Content', 'order': 13, 'tasks': [
                            {'id': '2f4ec0f1-cd7a-441a-8288-e788ec112af9', 'name': 'Supervise content creation', 'color': '#F1C232', 'from': new Date(2013, 10, 26, 9, 0, 0), 'to': new Date(2013, 10, 29, 16, 0, 0)}
                        ]},
                        {'id': 'ec0c5e31-449f-42d0-9e81-45c66322b640', 'name': 'Documentation', 'order': 14, 'tasks': [
                            {'id': 'edf2cece-2d17-436f-bead-691edbc7386b', 'name': 'Technical/User documentation', 'color': '#F1C232', 'from': new Date(2013, 10, 26, 8, 0, 0), 'to': new Date(2013, 10, 28, 18, 0, 0)}
                        ]}
                    ]};
            },
            getSampleTimespans: function() {
                return {
                    'timespan1': [
                        {
                            id: '1',
                            from: new Date(2013, 9, 21, 8, 0, 0),
                            to: new Date(2013, 9, 25, 15, 0, 0),
                            name: 'Sprint 1 Timespan'
                            //priority: undefined,
                            //classes: [], //Set custom classes names to apply to the timespan.
                            //data: undefined
                        }
                    ]
                };
            }
        };
    })
;
