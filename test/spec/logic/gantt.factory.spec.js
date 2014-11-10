'use strict';
describe('Unit: Gantt', function() {
    // Load the module with MainController
    beforeEach(module('gantt'));

    var Gantt;
    var moment;
    var $controller;
    var $rootScope;
    var $compile;

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
            {'name': 'Depl. & Final testing', 'color': '#F1C232', 'from': new Date(2013, 10, 21, 8, 0, 0), 'to': new Date(2013, 10, 22, 12, 0, 0)}
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

    beforeEach(inject(['$controller', '$rootScope', '$compile', 'Gantt', 'moment', function(_$controller_, _$rootScope_, _$compile_, _Gantt_, _moment_) {
        Gantt = _Gantt_;
        moment = _moment_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }]));

    it('register API and call api.on.ready event',
        function() {
            var $scope = $rootScope.$new();

            var ganttApi;
            var ready = false;
            $scope.api = function(api) {
                ganttApi = api;

                ganttApi.core.on.ready($scope, function() {
                    ready = true;
                });
            };

            $compile('<div gantt api="api"></div>')($scope);
            $scope.$digest();

            expect(ganttApi).toBeDefined();
            expect(ready).toBeTruthy();

            ganttApi = undefined;
            ready = false;

            $compile('<gantt api="api"></gantt>')($scope);
            $scope.$digest();

            expect(ganttApi).toBeDefined();
            expect(ready).toBeTruthy();
        }
    );

    var checkData = function(data, ganttElement) {
        var tasks = [];
        angular.forEach(data, function(row) {
            if (row.tasks) {
                tasks = tasks.concat(row.tasks);
            }
        });

        var rowLabelsElements = ganttElement.find('div.gantt-labels-body div.gantt-labels-row');
        var rowElements = ganttElement.find('div.gantt-body-rows div.gantt-row');
        var taskElements = ganttElement.find('div.gantt-body-rows div.gantt-task, div.gantt-body-rows div.gantt-task-milestone');

        expect(rowLabelsElements.length).toBe(data.length);
        expect(rowElements.length).toBe(data.length);
        expect(taskElements.length).toBe(tasks.length);

        angular.forEach(rowLabelsElements, function(rowLabelElement, i) {
            rowLabelElement = angular.element(rowLabelElement);

            var rowModel = data[i];
            var rowText = rowLabelElement.find('span').text();
            expect(rowText).toEqual(rowModel.name);

            var rowTaskElements = rowLabelElement.find('div.gantt-task, div.gantt-task-milestone');

            angular.forEach(rowTaskElements, function(rowTaskElement, j) {
                rowTaskElement = angular.element(rowTaskElements);

                var taskModel = rowModel.tasks[j];
                var taskText = rowTaskElement.find('span').text();
                expect(taskText).toEqual(taskModel.name);
            });
        });
    };

    it('Works with no data',
        function() {
            var $scope = $rootScope.$new();
            var ganttElement = $compile('<div gantt data="data"></div>')($scope);
            $scope.$digest();
            checkData([], ganttElement);
        });

    it('Load and modify data from $scope.data',
        function() {
            var $scope = $rootScope.$new();

            $scope.data = angular.copy(mockData);
            var ganttElement = $compile('<div gantt data="data"></div>')($scope);
            $scope.$digest();

            checkData($scope.data, ganttElement);

            $scope.data = [];
            $scope.$digest();
            checkData($scope.data, ganttElement);

            $scope.data = angular.copy(mockData);
            $scope.$digest();
            checkData($scope.data, ganttElement);

            $scope.data[2].name = 'Modified'; // Change row name
            $scope.$digest();
            checkData($scope.data, ganttElement);

            $scope.data[2].tasks.splice(1, 0); // Remove a task
            $scope.$digest();
            checkData($scope.data, ganttElement);

            $scope.data[2].tasks = undefined; // Removes all row task
            $scope.$digest();
            checkData($scope.data, ganttElement);

            $scope.data[2].tasks = []; // Set task array back
            $scope.$digest();
            checkData($scope.data, ganttElement);

            $scope.data[2].tasks.push(angular.copy(mockData[2].tasks[1])); // Add a task
            $scope.$digest();
            checkData($scope.data, ganttElement);

            $scope.data[2].tasks[0].name = 'Modified';
            $scope.$digest();
            checkData($scope.data, ganttElement);
        }
    );

    it('Load data from API',
        function() {
            var $scope = $rootScope.$new();

            var data = angular.copy(mockData);

            var ganttApi;
            var ready = false;
            $scope.api = function(api) {
                ganttApi = api;

                ganttApi.core.on.ready($scope, function() {
                    ready = true;
                    ganttApi.data.load(data);
                });
            };

            var ganttElement = $compile('<div gantt api="api" data="data"></div>')($scope);
            $scope.$digest();

            expect($scope.data).toEqual(data);
            checkData(data, ganttElement);
        }
    );

});
