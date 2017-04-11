export default function (ganttUtils, $compile) {
  'ngInject';
  // Provides the row sort functionality to any Gantt row
  // Uses the sortableState to share the current row

  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api;

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.sortable) === 'object') {
        for (let option in scope.options.sortable) {
          scope[option] = scope.options.sortable[option];
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true;
      }

      api.directives.on.new(scope, function (directiveName, rowScope, rowElement) {
        if (directiveName === 'ganttRowLabel' && rowElement.attr('drag') === undefined) {
          rowScope.checkDraggable = function () {
            let rowSortable = rowScope.row.model.sortable;

            if (typeof(rowSortable) === 'boolean') {
              rowSortable = {enabled: rowSortable};
            }

            return ganttUtils.firstProperty([rowSortable], 'enabled', scope.enabled);
          };

          rowScope.onDropSuccess = function () {
            rowScope.$evalAsync();
          };

          rowScope.onDrop = function (evt, data) {
            let row = rowScope.row.rowsManager.rowsMap[data.id];
            if (row !== rowScope) {
              rowScope.row.rowsManager.moveRow(row, rowScope.row);
              rowScope.$evalAsync();
            }
          };

          rowElement.attr('ui-draggable', '{{checkDraggable()}}');
          rowElement.attr('drag-channel', '\'sortable\'');
          rowElement.attr('ui-on-drop', 'onDrop($event, $data)');
          rowElement.attr('on-drop-success', 'onDropSuccess()');

          rowElement.attr('drop-channel', '\'sortable\'');
          rowElement.attr('drag', 'row.model');

          $compile(rowElement)(rowScope);
        }
      });

    }
  };
}
