'use strict';
describe('Unit: Columns', function() {
    // Load the module with MainController
    beforeEach(function(){
        module('gantt');
        module('gantt.labels');
    });

    var Gantt;
    var moment;
    var $controller;
    var $rootScope;
    var $compile;
    var $timeout;

    var mockData = [
        // Order is optional. If not specified it will be assigned automatically
        {'name': 'Milestones', 'height': '3em', classes: 'gantt-row-milestone', 'color': '#45607D', 'tasks': [
            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
            {'name': 'Kickoff', 'color': '#93C47D', 'from': '2013-10-07T09:00:00', 'to': '2013-10-07T10:00:00', 'data': 'Can contain any custom data or object'},
            {'name': 'Concept approval', 'color': '#93C47D', 'from': new Date(2013, 9, 18, 18, 0, 0), 'to': new Date(2013, 9, 18, 18, 0, 0), 'est': new Date(2013, 9, 16, 7, 0, 0), 'lct': new Date(2013, 9, 19, 0, 0, 0)},
            {'name': 'Development finished', 'color': '#93C47D', 'from': new Date(2013, 10, 15, 18, 0, 0), 'to': new Date(2013, 10, 15, 18, 0, 0)},
            {'name': 'Shop is running', 'color': '#93C47D', 'from': new Date(2013, 10, 22, 12, 0, 0), 'to': new Date(2013, 10, 22, 12, 0, 0)},
            {'name': 'Go-live', 'color': '#93C47D', 'from': new Date(2013, 10, 29, 16, 0, 0), 'to': new Date(2013, 10, 29, 16, 0, 0)}
        ], 'data': 'Can contain any custom data or object'},
        {'name': 'Status meetings', 'tasks': [
            {'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 9, 25, 15, 0, 0), 'to': new Date(2013, 9, 25, 18, 30, 0)},
            {'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 1, 15, 0, 0), 'to': new Date(2013, 10, 1, 18, 0, 0)},
            {'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 8, 15, 0, 0), 'to': new Date(2013, 10, 8, 18, 0, 0)},
            {'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 15, 15, 0, 0), 'to': new Date(2013, 10, 15, 18, 0, 0)},
            {'name': 'Demo', 'color': '#9FC5F8', 'from': new Date(2013, 10, 24, 9, 0, 0), 'to': new Date(2013, 10, 24, 10, 0, 0)}
        ]},
        {'name': 'Kickoff', 'tasks': [
            {'name': 'Day 1', 'color': '#9FC5F8', 'from': new Date(2013, 9, 7, 9, 0, 0), 'to': new Date(2013, 9, 7, 17, 0, 0),
                'progress': {'percent': 100, 'color': '#3C8CF8'}},
            {'name': 'Day 2', 'color': '#9FC5F8', 'from': new Date(2013, 9, 8, 9, 0, 0), 'to': new Date(2013, 9, 8, 17, 0, 0),
                'progress': {'percent': 100, 'color': '#3C8CF8'}},
            {'name': 'Day 3', 'color': '#9FC5F8', 'from': new Date(2013, 9, 9, 8, 30, 0), 'to': new Date(2013, 9, 9, 12, 0, 0),
                'progress': {'percent': 100, 'color': '#3C8CF8'}}
        ]},
        {'name': 'Create concept', 'tasks': [
            {'name': 'Create concept', 'color': '#F1C232', 'from': new Date(2013, 9, 10, 8, 0, 0), 'to': new Date(2013, 9, 16, 18, 0, 0), 'est': new Date(2013, 9, 8, 8, 0, 0), 'lct': new Date(2013, 9, 18, 20, 0, 0),
                'progress': 100}
        ]},
        {'name': 'Finalize concept', 'tasks': [
            {'name': 'Finalize concept', 'color': '#F1C232', 'from': new Date(2013, 9, 17, 8, 0, 0), 'to': new Date(2013, 9, 18, 18, 0, 0),
                'progress': 100}
        ]},
        {'name': 'Sprint 1', 'tasks': [
            {'name': 'Product list view', 'color': '#F1C232', 'from': new Date(2013, 9, 21, 8, 0, 0), 'to': new Date(2013, 9, 25, 15, 0, 0),
                'progress': 25}
        ]},
        {'name': 'Sprint 2', 'tasks': [
            {'name': 'Order basket', 'color': '#F1C232', 'from': new Date(2013, 9, 28, 8, 0, 0), 'to': new Date(2013, 10, 1, 15, 0, 0)}
        ]},
        {'name': 'Sprint 3', 'tasks': [
            {'name': 'Checkout', 'color': '#F1C232', 'from': new Date(2013, 10, 4, 8, 0, 0), 'to': new Date(2013, 10, 8, 15, 0, 0)}
        ]},
        {'name': 'Sprint 4', 'tasks': [
            {'name': 'Login&Singup and admin view', 'color': '#F1C232', 'from': new Date(2013, 10, 11, 8, 0, 0), 'to': new Date(2013, 10, 15, 15, 0, 0)}
        ]},
        {'name': 'Setup server', 'tasks': [
            {'name': 'HW', 'color': '#F1C232', 'from': new Date(2013, 10, 18, 8, 0, 0), 'to': new Date(2013, 10, 18, 12, 0, 0)}
        ]},
        {'name': 'Config server', 'tasks': [
            {'name': 'SW / DNS/ Backups', 'color': '#F1C232', 'from': new Date(2013, 10, 18, 12, 0, 0), 'to': new Date(2013, 10, 21, 18, 0, 0)}
        ]},
        {'name': 'Deployment', 'tasks': [
            {'name': 'Depl. & Final testing', 'color': '#F1C232', 'from': new Date(2013, 10, 21, 8, 0, 0), 'to': new Date(2013, 10, 22, 12, 0, 0), 'classes': 'gantt-task-deployment'}
        ]},
        {'name': 'Workshop', 'tasks': [
            {'name': 'On-side education', 'color': '#F1C232', 'from': new Date(2013, 10, 24, 9, 0, 0), 'to': new Date(2013, 10, 25, 15, 0, 0)}
        ]},
        {'name': 'Content', 'tasks': [
            {'name': 'Supervise content creation', 'color': '#F1C232', 'from': new Date(2013, 10, 26, 9, 0, 0), 'to': new Date(2013, 10, 29, 16, 0, 0)}
        ]},
        {'name': 'Documentation', 'tasks': [
            {'name': 'Technical/User documentation', 'color': '#F1C232', 'from': new Date(2013, 10, 26, 8, 0, 0), 'to': new Date(2013, 10, 28, 18, 0, 0)}
        ]}
    ];

    beforeEach(inject(['$controller', '$rootScope', '$compile', '$timeout', 'Gantt', 'moment', function(_$controller_, _$rootScope_, _$compile_, _$timeout_, _Gantt_, _moment_) {
        Gantt = _Gantt_;
        moment = _moment_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
    }]));

    it('First and last columns are at right position',
        function() {
            var width = 350;

            var $scope = $rootScope.$new();
            $scope.ganttElementWidth = width;
            $scope.data = angular.copy(mockData);

            var $element = angular.element();
            var gantt = new Gantt($scope, $element);

            gantt.loadData($scope.data);
            gantt.initialized();

            var columnsManager = gantt.columnsManager;

            var firstColumn = columnsManager.getColumnByPosition(0);
            var firstColumm2 = columnsManager.getFirstColumn();

            expect(firstColumn).toBe(firstColumm2);

            var lastColumn = columnsManager.getColumnByPosition(width);
            var lastColumn2 = columnsManager.getLastColumn();

            expect(lastColumn).toBe(lastColumn2);
        }
    );

    function expectValidDateFromPosition(gantt, width, ganttStartDate, ganttEndDate, x) {
        var ganttDate = gantt.getDateByPosition(x);
        var ganttX = gantt.getPositionByDate(ganttDate);

        expect(ganttX).toBeCloseTo(x);

        var totalDuration = ganttEndDate.diff(ganttStartDate, 'milliseconds');
        var leftDuration = ganttDate.diff(ganttStartDate, 'milliseconds');

        if (ganttStartDate.isDST() && !ganttDate.isDST()) {
            leftDuration -= 3600000;
        } else if (!ganttStartDate.isDST() && ganttDate.isDST()) {
            leftDuration += 3600000;
        }

        if (ganttStartDate.isDST() && !ganttEndDate.isDST()) {
            totalDuration -= 3600000;
        } else if (!ganttStartDate.isDST() && ganttEndDate.isDST()) {
            totalDuration += 3600000;
        }

        if (x === 0) {
            expect(leftDuration).toBe(0);
        } else {
            var ratio = leftDuration * (width/x) / totalDuration;
            expect(ratio).toBeCloseTo(1);
        }
    }

    it('Computes valid dates from range positions',
        function() {
            var width = 350;

            var $scope = $rootScope.$new();
            $scope.ganttElementWidth = width;
            $scope.data = angular.copy(mockData);
            $scope.columnMagnet = undefined;

            var $element = angular.element();
            var gantt = new Gantt($scope, $element);

            gantt.loadData($scope.data);
            gantt.initialized();

            var toDate;
            var fromDate;

            angular.forEach($scope.data, function(row) {
                if (row.tasks !== undefined) {
                    angular.forEach(row.tasks, function(task) {
                        if (fromDate === undefined || fromDate > task.from) {
                            fromDate = task.from;
                        }

                        if (toDate === undefined || toDate < task.to) {
                            toDate = task.to;
                        }
                    });
                }
            });

            var timeUnit = gantt.options.value('viewScale');

            fromDate.startOf(timeUnit);
            toDate.startOf(timeUnit).add(1, timeUnit);

            var ganttStartDate = gantt.getDateByPosition(0);
            var ganttEndDate = gantt.getDateByPosition(width);

            expect(ganttStartDate.isSame(fromDate)).toBeTruthy();
            expect(ganttEndDate.isSame(toDate)).toBeTruthy();

            for (var i=1; i < width; i++) {
                expectValidDateFromPosition(gantt, width, ganttStartDate, ganttEndDate, i);
            }
        }
    );

    it('Computes valid dates from previous positions',
        function() {
            var width = 350;

            var $scope = $rootScope.$new();
            $scope.ganttElementWidth = width;
            $scope.data = angular.copy(mockData);
            $scope.columnMagnet = undefined;

            var $element = angular.element();
            var gantt = new Gantt($scope, $element);

            gantt.loadData($scope.data);
            gantt.initialized();

            var toDate;
            var fromDate;

            angular.forEach($scope.data, function(row) {
                if (row.tasks !== undefined) {
                    angular.forEach(row.tasks, function(task) {
                        if (fromDate === undefined || fromDate > task.from) {
                            fromDate = task.from;
                        }

                        if (toDate === undefined || toDate < task.to) {
                            toDate = task.to;
                        }
                    });
                }
            });

            var timeUnit = gantt.options.value('viewScale');

            fromDate.startOf(timeUnit);
            toDate.startOf(timeUnit).add(1, timeUnit);

            var ganttStartDate = gantt.getDateByPosition(0);
            var ganttEndDate = gantt.getDateByPosition(width);

            expect(ganttStartDate.isSame(fromDate)).toBeTruthy();
            expect(ganttEndDate.isSame(toDate)).toBeTruthy();

            for (var i=0; i > -width; i--) {
             expectValidDateFromPosition(gantt, width, ganttStartDate, ganttEndDate, i);
            }
        }
    );

    it('Computes valid dates from next positions',
        function() {
            var width = 350;

            var $scope = $rootScope.$new();
            $scope.ganttElementWidth = width;
            $scope.data = angular.copy(mockData);
            $scope.columnMagnet = undefined;

            var $element = angular.element();
            var gantt = new Gantt($scope, $element);

            gantt.loadData($scope.data);
            gantt.initialized();

            var toDate;
            var fromDate;

            angular.forEach($scope.data, function(row) {
                if (row.tasks !== undefined) {
                    angular.forEach(row.tasks, function(task) {
                        if (fromDate === undefined || fromDate > task.from) {
                            fromDate = task.from;
                        }

                        if (toDate === undefined || toDate < task.to) {
                            toDate = task.to;
                        }
                    });
                }
            });

            var timeUnit = gantt.options.value('viewScale');

            fromDate.startOf(timeUnit);
            toDate.startOf(timeUnit).add(1, timeUnit);

            var ganttStartDate = gantt.getDateByPosition(0);
            var ganttEndDate = gantt.getDateByPosition(width);

            expect(ganttStartDate.isSame(fromDate)).toBeTruthy();
            expect(ganttEndDate.isSame(toDate)).toBeTruthy();

            for (var i=width; i < 2 * width; i++) {
                expectValidDateFromPosition(gantt, width, ganttStartDate, ganttEndDate, i);
            }
        }
    );
});
