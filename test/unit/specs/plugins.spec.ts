import angular, {ICompileService, IRootScopeService, ITimeoutService} from 'angular';
import 'angular-mocks';

import {expect} from 'chai';
import jQuery from 'jquery';

describe('Plugins', function () {
  // Load the module with MainController
  beforeEach(
    angular.mock.module('gantt', 'gantt.labels', 'gantt.sortable', 'gantt.movable', 'gantt.drawtask',
      'gantt.tooltips', 'gantt.bounds', 'gantt.progress', 'gantt.table', 'gantt.tree', 'gantt.groups'
    )
  );

  let Gantt;
  let $rootScope: IRootScopeService;
  let $compile: ICompileService;
  let $timeout: ITimeoutService;

  let mockData = [
    // Order is optional. If not specified it will be assigned automatically
    {
      name: 'Milestones',
      height: '3em',
      sortable: false,
      drawTask: false,
      classes: 'gantt-row-milestone',
      color: '#45607D',
      tasks: [
        // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
        {
          name: 'Kickoff',
          color: '#93C47D',
          from: '2013-10-07T09:00:00',
          to: '2013-10-07T10:00:00',
          data: 'Can contain any custom data or object'
        },
        {
          name: 'Concept approval',
          color: '#93C47D',
          from: new Date(2013, 9, 18, 18, 0, 0),
          to: new Date(2013, 9, 18, 18, 0, 0),
          est: new Date(2013, 9, 16, 7, 0, 0),
          lct: new Date(2013, 9, 19, 0, 0, 0)
        },
        {
          name: 'Development finished',
          color: '#93C47D',
          from: new Date(2013, 10, 15, 18, 0, 0),
          to: new Date(2013, 10, 15, 18, 0, 0)
        },
        {
          name: 'Shop is running',
          color: '#93C47D',
          from: new Date(2013, 10, 22, 12, 0, 0),
          to: new Date(2013, 10, 22, 12, 0, 0)
        },
        {
          name: 'Go-live',
          color: '#93C47D',
          from: new Date(2013, 10, 29, 16, 0, 0),
          to: new Date(2013, 10, 29, 16, 0, 0)
        }
      ],
      data: 'Can contain any custom data or object'
    },
    {
      name: 'Status meetings', tasks: [
        {name: 'Demo #1', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0)},
        {name: 'Demo #2', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0)},
        {name: 'Demo #3', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0)},
        {name: 'Demo #4', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
        {name: 'Demo #5', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0)}
      ]
    },
    {
      name: 'Kickoff', movable: {allowResizing: false}, tasks: [
        {
          name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
          progress: {percent: 100, color: '#3C8CF8'}, movable: false
        },
        {
          name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
          progress: {percent: 100, color: '#3C8CF8'}
        },
        {
          name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
          progress: {percent: 100, color: '#3C8CF8'}
        }
      ]
    },
    {
      name: 'Create concept', tasks: [
        {
          name: 'Create concept',
          content: '<i class="fa fa-cog"></i> {{task.model.name}}',
          color: '#F1C232',
          from: new Date(2013, 9, 10, 8, 0, 0),
          to: new Date(2013, 9, 16, 18, 0, 0),
          est: new Date(2013, 9, 8, 8, 0, 0),
          lct: new Date(2013, 9, 18, 20, 0, 0),
          progress: 100
        }
      ]
    },
    {
      name: 'Finalize concept', tasks: [
        {
          name: 'Finalize concept',
          color: '#F1C232',
          from: new Date(2013, 9, 17, 8, 0, 0),
          to: new Date(2013, 9, 18, 18, 0, 0),
          progress: 100
        }
      ]
    },
    {
      id: 'development',
      name: 'Development',
      children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
      content: '<i class="fa fa-file-code-o"></i> {{row.model.name}}'
    },
    {
      name: 'Sprint 1', tooltips: false, tasks: [
        {
          name: 'Product list view',
          color: '#F1C232',
          from: new Date(2013, 9, 21, 8, 0, 0),
          to: new Date(2013, 9, 25, 15, 0, 0),
          progress: 25
        }
      ]
    },
    {
      name: 'Sprint 2', tasks: [
        {
          name: 'Order basket',
          color: '#F1C232',
          from: new Date(2013, 9, 28, 8, 0, 0),
          to: new Date(2013, 10, 1, 15, 0, 0)
        }
      ]
    },
    {
      name: 'Sprint 3', tasks: [
        {name: 'Checkout', color: '#F1C232', from: new Date(2013, 10, 4, 8, 0, 0), to: new Date(2013, 10, 8, 15, 0, 0)}
      ]
    },
    {
      name: 'Sprint 4', tasks: [
        {
          name: 'Login & Signup & Admin Views',
          color: '#F1C232',
          from: new Date(2013, 10, 11, 8, 0, 0),
          to: new Date(2013, 10, 15, 15, 0, 0)
        }
      ]
    },
    {name: 'Hosting', content: '<i class="fa fa-server"></i> {{row.model.name}}'},
    {
      name: 'Setup', tasks: [
        {name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0)}
      ]
    },
    {
      name: 'Config', tasks: [
        {
          name: 'SW / DNS/ Backups',
          color: '#F1C232',
          from: new Date(2013, 10, 18, 12, 0, 0),
          to: new Date(2013, 10, 21, 18, 0, 0)
        }
      ]
    },
    {name: 'Server', parent: 'Hosting', children: ['Setup', 'Config']},
    {
      name: 'Deployment', parent: 'Hosting', tasks: [
        {
          name: 'Depl. & Final testing',
          color: '#F1C232',
          from: new Date(2013, 10, 21, 8, 0, 0),
          to: new Date(2013, 10, 22, 12, 0, 0),
          'classes': 'gantt-task-deployment'
        }
      ]
    },
    {
      name: 'Workshop', tasks: [
        {
          name: 'On-side education',
          color: '#F1C232',
          from: new Date(2013, 10, 24, 9, 0, 0),
          to: new Date(2013, 10, 25, 15, 0, 0)
        }
      ]
    },
    {
      name: 'Content', tasks: [
        {
          name: 'Supervise content creation',
          color: '#F1C232',
          from: new Date(2013, 10, 26, 9, 0, 0),
          to: new Date(2013, 10, 29, 16, 0, 0)
        }
      ]
    },
    {
      name: 'Documentation', tasks: [
        {
          name: 'Technical/User documentation',
          color: '#F1C232',
          from: new Date(2013, 10, 26, 8, 0, 0),
          to: new Date(2013, 10, 28, 18, 0, 0)
        }
      ]
    }
  ];

  beforeEach(inject(['$rootScope', '$compile', '$timeout', 'Gantt', function ($tRootScope: IRootScopeService, $tCompile: ICompileService, $tTimeout: ITimeoutService, tGantt) {
    Gantt = tGantt;
    $rootScope = $tRootScope;
    $compile = $tCompile;
    $timeout = $tTimeout;
  }]));

  describe('every plugins', function () {
    it('should load without error',
      function () {
        let $scope = $rootScope.$new();

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
      function () {
        let $scope = $rootScope.$new();

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

  let checkLabels = function (data, ganttElement, contentNotSupported?) {
    let rowLabelsElements = jQuery(ganttElement).find('.gantt-row-label').not('.gantt-row-label-header').find('.gantt-label-text');
    expect(rowLabelsElements.length).to.be.eq(data.length);

    angular.forEach(rowLabelsElements, function (rowLabelElement, i) {
      rowLabelElement = jQuery(rowLabelElement);

      let rowModel = data[i];
      let rowText = rowLabelElement.text().trim();
      if (contentNotSupported || rowModel.content === undefined) {
        expect(rowText).to.be.eq(rowModel.name);
      } else {
        let rowHtmlModel = rowModel.content;
        rowHtmlModel = rowHtmlModel.replace('{{row.model.name}}', rowModel.name);
        let expectedRowText = rowHtmlModel.replace(/<(?:.|\n)*?>/gm, '').trim(); // Strip HTML
        expect(rowText).to.be.eq(expectedRowText);
      }

      if (rowModel.classes) {
        let rowClasses = rowModel.classes;
        if (!angular.isArray(rowClasses)) {
          rowClasses = [rowClasses];
        }

        angular.forEach(rowClasses, function (rowClass) {
          expect(rowLabelElement.parents().hasClass(rowClass)).to.be.ok;
        });
      }
    });
  };

  describe('labels', function () {
    it('should display labels',
      function () {
        let $scope = $rootScope.$new();

        $scope.data = angular.copy(mockData);
        let ganttElement = $compile('<div gantt data="data"><gantt-labels></gantt-labels></div>')($scope);
        $scope.$digest();
        $timeout.flush();

        checkLabels($scope.data, ganttElement, true);
      }
    );
  });

  describe('table', function () {
    it('should display labels',
      function () {
        let $scope = $rootScope.$new();

        $scope.data = angular.copy(mockData);
        let ganttElement = $compile('<div gantt data="data"><gantt-table></gantt-table></div>')($scope);
        $scope.$digest();
        $timeout.flush();

        checkLabels($scope.data, ganttElement);
      }
    );
  });

  describe('tree',
    function () {
      it('should display labels',
        function () {
          let $scope = $rootScope.$new();

          $scope.data = angular.copy(mockData);
          let ganttElement = $compile('<div gantt data="data"><gantt-tree></gantt-tree></div>')($scope);
          $scope.$digest();
          $timeout.flush();

          // Set the data in tree view ordering
          let orderedData = $scope.data.slice();
          let indices = {};

          angular.forEach($scope.data, function (rowModel, i) {
            if (rowModel.name) {
              indices[rowModel.name] = i;
            }
          });

          /*jshint sub:true */
          let configRow = orderedData[indices['Config']];
          let setupRow = orderedData[indices['Setup']];
          let serverRow = orderedData[indices['Server']];

          orderedData[indices['Setup']] = serverRow;
          orderedData[indices['Config']] = setupRow;
          orderedData[indices['Server']] = configRow;
          /*jshint sub:false */

          checkLabels(orderedData, ganttElement);
        }
      );

      it('should contain nodes that can expand and collapse',
        function () {
          let $scope = $rootScope.$new();
          $scope.data = angular.copy(mockData);

          let ganttApi;
          let ready = false;
          $scope.api = function (api) {
            ganttApi = api;

            ganttApi.core.on.ready($scope, function () {
              ready = true;
            });
          };

          let ganttElement = $compile('<div gantt api="api" data="data">' +
            '<gantt-tree></gantt-tree>' +
            '</div>')($scope);

          $scope.$digest();
          $timeout.flush();

          expect(ganttApi).to.be.not.undefined;
          expect(ready).to.be.ok;

          expect(ganttApi.tree.isCollapsed(undefined)).to.be.undefined;

          // All rows should be expanded on init
          angular.forEach(ganttApi.gantt.rowsManager.rows, function (row) {
            expect(ganttApi.tree.isCollapsed(row)).to.be.not.ok;
          });

          // Collapse all rows
          ganttApi.tree.collapseAll();
          $scope.$digest();

          // Development row should be collapsed
          expect(ganttApi.tree.isCollapsed('development')).to.be.ok;

          // All rows should be collapsed
          angular.forEach(ganttApi.gantt.rowsManager.rows, function (row) {
            expect(ganttApi.tree.isCollapsed(row)).to.be.ok;
          });

          // Expand all rows
          ganttApi.tree.expandAll();
          $scope.$digest();

          // All rows should be expanded
          angular.forEach(ganttApi.gantt.rowsManager.rows, function (row) {
            expect(ganttApi.tree.isCollapsed(row)).to.be.not.ok;
          });

          // GanttTreeNodeController
          let treeNodeElement = jQuery(ganttElement).find('[ng-controller="GanttTreeNodeController"]').first();
          let ganttTreeNodeController = angular.element(treeNodeElement[0]).scope();

          // First row name should be "Milestones"
          expect(ganttTreeNodeController.getValue()).to.be.eq('Milestones');

          // Collapsing should be disabled - no child rows
          expect(ganttTreeNodeController.isCollapseDisabled()).to.be.ok;

          // Should get row content correctly. If undefined and if defined
          expect(ganttTreeNodeController.getRowContent()).to.be.eq('{{row.model.name}}');

          // Test row
          let testRow = ganttApi.gantt.rowsManager.rows[0];

          // Test undefined collapsed
          testRow._collapsed = undefined;
          expect(ganttApi.tree.isCollapsed(testRow)).to.be.not.ok;

          // Set custom content
          testRow.model.content = '> {{row.model.name}}';
          expect(ganttTreeNodeController.getRowContent()).to.be.eq('> {{row.model.name}}');

          // GanttTreeController
          let treeElement = jQuery(ganttElement).find('[ng-controller="GanttTreeController"]');
          let ganttTreeController = angular.element(treeElement).scope();

          // Get default header
          expect(ganttTreeController.getHeader()).to.be.eq('Name');

          // Get default header content
          expect(ganttTreeController.getHeaderContent()).to.be.eq('{{getHeader()}}');
        }
      );
    }
  );

});
