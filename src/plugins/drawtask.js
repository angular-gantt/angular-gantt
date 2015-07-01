(function() {
  'use strict';
  angular.module('gantt.drawtask', ['gantt']).directive('ganttDrawTask', [
    'ganttMouseOffset', 'moment',
    function(mouseOffset, moment) {
      return {
        restrict: 'E',
        require: '^gantt',
        scope: {
          enabled: '=?',
          taskModelFactory: '=taskFactory'
        },
        link: function(scope, element, attrs, ganttCtrl) {
          var api = ganttCtrl.gantt.api;

          if (scope.enabled === undefined) {
            scope.enabled = true;
          }

          api.directives.on.new(scope, function(directiveName,
            directiveScope, element) {
            if (directiveName === 'ganttRow') {
              var create = function(taskModel, from, to, digest) {
                taskModel.from = from;
                taskModel.to = to;
                var task = directiveScope.row.addTask(
                  taskModel);
                task.isResizing = true;
                task.updatePosAndSize();
                directiveScope.row.updateVisibleTasks();
                if (digest)
                  directiveScope.row.$scope.$digest();
              };

              var drawHandler = function(evt) {
                var evtTarget = (evt.target ? evt.target : evt.srcElement);
                var enabled = angular.isFunction(scope.enabled) ?
                  scope.enabled(evt) : scope.enabled;
                if (enabled && evtTarget.className.indexOf(
                    'gantt-row') > -1) {
                  var startDate = api.core.getDateByPosition(
                    mouseOffset.getOffset(evt).x);
                  var endDate = moment(startDate);


                  var taskModel = scope.taskModelFactory();
                  if (taskModel.then) {
                    taskModel.then(function(data) {
                      create(data, startDate, endDate, false);
                    });
                  } else {
                    create(taskModel, startDate, endDate, true);
                  }
                }
              };

              element.on('mousedown', drawHandler);
              directiveScope.drawTaskHandler = drawHandler;
            }
          });

          api.directives.on.destroy(scope, function(directiveName,
            directiveScope, element) {
            if (directiveName === 'ganttRow') {
              element.off('mousedown', directiveScope.drawTaskHandler);
              delete directiveScope.drawTaskHandler;
            }
          });
        }
      };
    }
  ]);
}());
