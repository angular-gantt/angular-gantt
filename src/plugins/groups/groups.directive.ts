import angular from 'angular';

export default function (ganttUtils, GanttHierarchy, $compile, $document) {
  'ngInject';
  // Provides the row sort functionality to any Gantt row
  // Uses the sortableState to share the current row

  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?',
      display: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api;

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.groups) === 'object') {
        for (let option in scope.options.groups) {
          scope[option] = scope.options.groups[option];
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true;
      }

      if (scope.display === undefined) {
        scope.display = 'group';
      }

      scope.hierarchy = new GanttHierarchy();

      function refresh() {
        scope.hierarchy.refresh(ganttCtrl.gantt.rowsManager.filteredRows);
      }

      ganttCtrl.gantt.api.registerMethod('groups', 'refresh', refresh, this);
      ganttCtrl.gantt.$scope.$watchCollection('gantt.rowsManager.filteredRows', function () {
        refresh();
      });

      api.directives.on.new(scope, function (directiveName, rowScope, rowElement) {
        if (directiveName === 'ganttRow') {
          let taskGroupScope = rowScope.$new();
          taskGroupScope.pluginScope = scope;

          let ifElement = $document[0].createElement('div');
          angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');

          let taskGroupElement = $document[0].createElement('gantt-task-group');
          if (attrs.templateUrl !== undefined) {
            angular.element(taskGroupElement).attr('data-template-url', attrs.templateUrl);
          }
          if (attrs.template !== undefined) {
            angular.element(taskGroupElement).attr('data-template', attrs.template);
          }

          angular.element(ifElement).append(taskGroupElement);

          rowElement.append($compile(ifElement)(taskGroupScope));
        }
      });
    }
  };
}
