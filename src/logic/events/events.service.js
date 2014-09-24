'use strict';
gantt.service('Events', ['mouseOffset', function(mouseOffset) {
    return {
        buildTaskEventData: function(evt, element, task, gantt) {
            var data = {evt:evt, element:element, task:task};
            if (gantt !== undefined) {
                var x = mouseOffset.getOffset(evt).x;
                // TODO: https://github.com/angular-gantt/angular-gantt/issues/120
                // xInEm = x / $scope.getPxToEmFactor(),
                data.column = gantt.getColumnByPosition(x + task.left);
                data.date = gantt.getDateByPosition(x + task.left);
            }
            return data;
        }
    };
}]);
