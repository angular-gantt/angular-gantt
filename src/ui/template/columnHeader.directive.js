'use strict';
gantt.directive('ganttColumnHeader', ['GanttEvents', function(Events) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.columnHeader.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('click', function(evt) {
                $scope.gantt.api.columns.raise.click(Events.buildColumnEventData(evt, $element, $scope.column));
            });

            $element.bind('dblclick', function(evt) {
                $scope.gantt.api.columns.raise.dblclick(Events.buildColumnEventData(evt, $element, $scope.column));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.gantt.api.columns.raise.contextmenu(Events.buildColumnEventData(evt, $element, $scope.column));
            });
        }]
    };
}]);
