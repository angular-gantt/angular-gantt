'use strict';
gantt.directive('ganttRow', ['GanttEvents', function(Events) {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.row.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.row.$element = $element;

            $element.bind('mousedown', function(evt) {
                $scope.row.rowsManager.gantt.api.rows.raise.mousedown(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('mouseup', function(evt) {
                $scope.row.rowsManager.gantt.api.rows.raise.mouseup(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('click', function(evt) {
                $scope.row.rowsManager.gantt.api.rows.raise.click(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('dblclick', function(evt) {
                $scope.row.rowsManager.gantt.api.rows.raise.dblclick(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.row.rowsManager.gantt.api.rows.raise.contextmenu(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });


        }]
    };
}]);
