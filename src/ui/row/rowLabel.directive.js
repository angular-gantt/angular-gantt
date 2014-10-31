'use strict';
gantt.directive('ganttRowLabel', ['GanttEvents', function(Events) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.rowLabel.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('mousedown', function(evt) {
                $scope.gantt.api.labels.raise.mousedown(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('mouseup', function(evt) {
                $scope.gantt.api.labels.raise.mouseup(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('click', function(evt) {
                $scope.gantt.api.labels.raise.click(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('dblclick', function(evt) {
                $scope.gantt.api.labels.raise.dblclick(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.gantt.api.labels.raise.contextmenu(Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });


        }]
    };
}]);
