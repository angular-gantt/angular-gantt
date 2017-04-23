import angular from 'angular';

import GanttUtilsService from 'core/logic/util/utils.service';

export default function (ganttUtils: GanttUtilsService, $compile, $document) {
  'ngInject';
  // Provides the row sort functionality to any Gantt row
  // Uses the sortableState to share the current row

  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?',
      columns: '=?',
      headers: '=?',
      classes: '=?',
      contents: '=?',
      headerContents: '=?',
      formatters: '=?',
      headerFormatter: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api;

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.table) === 'object') {
        for (let option in scope.options.table) {
          scope[option] = scope.options.table[option];
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true;
      }

      if (scope.columns === undefined) {
        scope.columns = ['model.name'];
      }

      if (scope.headers === undefined) {
        scope.headers = {'model.name': 'Name'};
      }

      if (scope.contents === undefined) {
        scope.contents = {};
      }

      if (scope.headerContents === undefined) {
        scope.headerContents = {};
      }

      if (scope.classes === undefined) {
        scope.classes = {};
      }

      if (scope.formatters === undefined) {
        scope.formatters = {};
      }

      api.directives.on.new(scope, function (directiveName, sideContentScope, sideContentElement) {
        if (directiveName === 'ganttSideContent') {
          let tableScope = sideContentScope.$new();
          tableScope.pluginScope = scope;

          let ifElement = $document[0].createElement('div');
          angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');
          angular.element(ifElement).addClass('side-element');

          let tableElement = $document[0].createElement('gantt-side-content-table');
          angular.element(ifElement).append(tableElement);

          sideContentElement.append($compile(ifElement)(tableScope));
        }
      });

    }
  };
}
