'use strict';
describe('Plugins', function() {
    // Load the module with MainController
    beforeEach(function(){
        module('gantt');
        module('gantt.labels');
        module('gantt.sortable');
        module('gantt.movable');
        module('gantt.drawtask');
        module('gantt.tooltips');
        module('gantt.bounds');
        module('gantt.progress');
        module('gantt.table');
        module('gantt.tree');
        module('gantt.groups');
    });

    var Gantt;
    var moment;
    var $controller;
    var $rootScope;
    var $compile;
    var $timeout;

    var mockData = [
        // Order is optional. If not specified it will be assigned automatically
        {name: 'Milestones', height: '3em', sortable: false, classes: 'gantt-row-milestone', color: '#45607D', tasks: [
            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
            {name: 'Kickoff', color: '#93C47D', from: '2013-10-07T09:00:00', to: '2013-10-07T10:00:00', data: 'Can contain any custom data or object'},
            {name: 'Concept approval', color: '#93C47D', from: new Date(2013, 9, 18, 18, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0), est: new Date(2013, 9, 16, 7, 0, 0), lct: new Date(2013, 9, 19, 0, 0, 0)},
            {name: 'Development finished', color: '#93C47D', from: new Date(2013, 10, 15, 18, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
            {name: 'Shop is running', color: '#93C47D', from: new Date(2013, 10, 22, 12, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)},
            {name: 'Go-live', color: '#93C47D', from: new Date(2013, 10, 29, 16, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
        ], data: 'Can contain any custom data or object'},
        {name: 'Status meetings', tasks: [
            {name: 'Demo #1', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0)},
            {name: 'Demo #2', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0)},
            {name: 'Demo #3', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0)},
            {name: 'Demo #4', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
            {name: 'Demo #5', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0)}
        ]},
        {name: 'Kickoff', movable: {allowResizing: false}, tasks: [
            {name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
                progress: {percent: 100, color: '#3C8CF8'}, movable: false},
            {name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
                progress: {percent: 100, color: '#3C8CF8'}},
            {name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
                progress: {percent: 100, color: '#3C8CF8'}}
        ]},
        {name: 'Create concept', tasks: [
            {name: 'Create concept', content: '<i class="fa fa-cog"></i>{{task.model.name}}', color: '#F1C232', from: new Date(2013, 9, 10, 8, 0, 0), to: new Date(2013, 9, 16, 18, 0, 0), est: new Date(2013, 9, 8, 8, 0, 0), lct: new Date(2013, 9, 18, 20, 0, 0),
                progress: 100}
        ]},
        {name: 'Finalize concept', tasks: [
            {name: 'Finalize concept', color: '#F1C232', from: new Date(2013, 9, 17, 8, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0),
                progress: 100}
        ]},
        {id: 'development', name: 'Development', children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'], content: '<i class="fa fa-file-code-o"></i> {{row.model.name}}'},
        {name: 'Sprint 1', tooltips: false, tasks: [
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
            {name: 'Login & Signup & Admin Views', color: '#F1C232', from: new Date(2013, 10, 11, 8, 0, 0), to: new Date(2013, 10, 15, 15, 0, 0)}
        ]},
        {name: 'Hosting', content: '<i class="fa fa-server"></i> {{row.model.name}}'},
        {name: 'Setup', tasks: [
            {name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0)}
        ]},
        {name: 'Config', tasks: [
            {name: 'SW / DNS/ Backups', color: '#F1C232', from: new Date(2013, 10, 18, 12, 0, 0), to: new Date(2013, 10, 21, 18, 0, 0)}
        ]},
        {name: 'Server', parent: 'Hosting', children: ['Setup', 'Config']},
        {name: 'Deployment', parent: 'Hosting', tasks: [
            {name: 'Depl. & Final testing', color: '#F1C232', from: new Date(2013, 10, 21, 8, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0), 'classes': 'gantt-task-deployment'}
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

    beforeEach(inject(['$controller', '$rootScope', '$compile', '$timeout', 'Gantt', 'moment', function(_$controller_, _$rootScope_, _$compile_, _$timeout_, _Gantt_, _moment_) {
        Gantt = _Gantt_;
        moment = _moment_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
    }]));

    describe('every plugins', function() {
        it('should load without error',
            function() {
                var $scope = $rootScope.$new();

                $compile('<div gantt api="api">' +
                '<gantt-labels></gantt-labels>' +
                '<gantt-tree></gantt-tree>' +
                '<gantt-table></gantt-table>' +
                '<gantt-groups></gantt-groups>' +
                '<gantt-tooltips></gantt-tooltips>' +
                '<gantt-bounds></gantt-bounds>' +
                '<gantt-progress></gantt-progress>' +
                '<gantt-sortable></gantt-sortable>' +
                '<gantt-movable></gantt-movable>' +
                '<gantt-draw-task></gantt-draw-task>' +
                '</div>')($scope);

                $scope.$digest();
                $timeout.flush();
            }
        );

        it('should destroy scope without error',
            function() {
                var $scope = $rootScope.$new();

                $scope.data = angular.copy(mockData);
                $compile('<div gantt api="api">' +
                '<gantt-labels></gantt-labels>' +
                '<gantt-tree></gantt-tree>' +
                '<gantt-table></gantt-table>' +
                '<gantt-groups></gantt-groups>' +
                '<gantt-tooltips></gantt-tooltips>' +
                '<gantt-bounds></gantt-bounds>' +
                '<gantt-progress></gantt-progress>' +
                '<gantt-sortable></gantt-sortable>' +
                '<gantt-movable></gantt-movable>' +
                '<gantt-draw-task></gantt-draw-task>' +
                '</div>')($scope);
                $scope.$digest();
                $timeout.flush();

                $scope.$destroy();
            }
        );
    });

    var checkLabels = function(data, ganttElement, contentNotSupported) {
        var rowLabelsElements = ganttElement.find('.gantt-row-label').not('.gantt-row-label-header').find('.gantt-label-text');
        expect(rowLabelsElements.length).toBe(data.length);

        angular.forEach(rowLabelsElements, function(rowLabelElement, i) {
            rowLabelElement = angular.element(rowLabelElement);

            var rowModel = data[i];
            var rowText = rowLabelElement.text();
            if (contentNotSupported || rowModel.content === undefined) {
                expect(rowText).toEqual(rowModel.name);
            } else {
                var rowHtmlModel = rowModel.content;
                rowHtmlModel = rowHtmlModel.replace('{{row.model.name}}', rowModel.name);
                var expectedRowText = rowHtmlModel.replace(/<(?:.|\n)*?>/gm, ''); // Strip HTML
                expect(rowText).toEqual(expectedRowText);
            }

            if (rowModel.classes) {
                var rowClasses = rowModel.classes;
                if (!angular.isArray(rowClasses)) {
                    rowClasses = [rowClasses];
                }

                angular.forEach(rowClasses, function(rowClass) {
                    expect(rowLabelElement.parents().hasClass(rowClass)).toBeTruthy();
                });
            }
        });
    };

    describe('labels', function() {
        it('should display labels',
            function() {
                var $scope = $rootScope.$new();

                $scope.data = angular.copy(mockData);
                var ganttElement = $compile('<div gantt data="data"><gantt-labels></gantt-labels></div>')($scope);
                $scope.$digest();
                $timeout.flush();

                checkLabels($scope.data, ganttElement, true);
            }
        );
    });

    describe('table', function() {
        it('should display labels',
            function() {
                var $scope = $rootScope.$new();

                $scope.data = angular.copy(mockData);
                var ganttElement = $compile('<div gantt data="data"><gantt-table></gantt-table></div>')($scope);
                $scope.$digest();
                $timeout.flush();

                checkLabels($scope.data, ganttElement);
            }
        );
    });

    describe('tree',
        function() {
            it('should display labels',
                function() {
                    var $scope = $rootScope.$new();

                    $scope.data = angular.copy(mockData);
                    var ganttElement = $compile('<div gantt data="data"><gantt-tree></gantt-tree></div>')($scope);
                    $scope.$digest();
                    $timeout.flush();

                    // Set the data in tree view ordering
                    var orderedData = $scope.data.slice();
                    var indices = {};

                    angular.forEach($scope.data, function(rowModel, i) {
                        if (rowModel.name) {
                            indices[rowModel.name] = i;
                        }
                    });

                    /*jshint sub:true */
                    var configRow = orderedData[indices['Config']];
                    var setupRow = orderedData[indices['Setup']];
                    var serverRow = orderedData[indices['Server']];

                    orderedData[indices['Setup']] = serverRow;
                    orderedData[indices['Config']] = setupRow;
                    orderedData[indices['Server']] = configRow;
                    /*jshint sub:false */

                    checkLabels(orderedData, ganttElement);
                }
            );

            it('should contain nodes that can expand and collapse',
                function() {
                    var $scope = $rootScope.$new();
                    $scope.data = angular.copy(mockData);

                    var ganttApi;
                    var ready = false;
                    $scope.api = function(api) {
                        ganttApi = api;

                        ganttApi.core.on.ready($scope, function() {
                            ready = true;
                        });
                    };

                    var ganttElement = $compile('<div gantt api="api" data="data">' +
                    '<gantt-tree></gantt-tree>' +
                    '</div>')($scope);

                    $scope.$digest();
                    $timeout.flush();

                    expect(ganttApi).toBeDefined();
                    expect(ready).toBeTruthy();

                    expect(ganttApi.tree.isCollapsed(undefined)).toBeUndefined();

                    // All rows should be expanded on init
                    angular.forEach(ganttApi.gantt.rowsManager.rows, function(row) {
                        expect(ganttApi.tree.isCollapsed(row)).toBeFalsy();
                    });

                    // Collapse all rows
                    ganttApi.tree.collapseAll();
                    $scope.$digest();

                    // Development row should be collapsed
                    expect(ganttApi.tree.isCollapsed('development')).toBeTruthy();

                    // All rows should be collapsed
                    angular.forEach(ganttApi.gantt.rowsManager.rows, function(row) {
                        expect(ganttApi.tree.isCollapsed(row)).toBeTruthy();
                    });

                    // Expand all rows
                    ganttApi.tree.expandAll();
                    $scope.$digest();

                    // All rows should be expanded
                    angular.forEach(ganttApi.gantt.rowsManager.rows, function(row) {
                        expect(ganttApi.tree.isCollapsed(row)).toBeFalsy();
                    });

                    // GanttTreeNodeController
                    var treeNodeElement = ganttElement.find('[ng-controller="GanttTreeNodeController"]').first();
                    var ganttTreeNodeController = angular.element(treeNodeElement).scope();

                    // First row name should be "Milestones"
                    expect(ganttTreeNodeController.getValue()).toBe('Milestones');

                    // Collapsing should be disabled - no child rows
                    expect(ganttTreeNodeController.isCollapseDisabled()).toBeTruthy();

                    // Should get row content correctly. If undefined and if defined
                    expect(ganttTreeNodeController.getRowContent()).toBe('{{row.model.name}}');

                    // Test row
                    var testRow = ganttApi.gantt.rowsManager.rows[0];

                    // Test undefined collapsed
                    testRow._collapsed = undefined;
                    expect(ganttApi.tree.isCollapsed(testRow)).toBeFalsy();

                    // Set custom content
                    testRow.model.content = '> {{row.model.name}}';
                    expect(ganttTreeNodeController.getRowContent()).toBe('> {{row.model.name}}');

                    // GanttTreeController
                    var treeElement = ganttElement.find('[ng-controller="GanttTreeController"]');
                    var ganttTreeController = angular.element(treeElement).scope();

                    // Get default header
                    expect(ganttTreeController.getHeader()).toBe('Name');

                    // Get default header content
                    expect(ganttTreeController.getHeaderContent()).toBe('{{getHeader()}}');
                }
            );
        }
    );



});
