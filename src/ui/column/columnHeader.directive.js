'use strict';
gantt.directive('ganttColumnHeader', ['Events', 'GANTT_EVENTS', function(Events, GANTT_EVENTS) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'default.columnHeader.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('click', function(evt) {
                $scope.$emit(GANTT_EVENTS.COLUMN_CLICKED, Events.buildColumnEventData(evt, $element, $scope.column));
            });

            $element.bind('dblclick', function(evt) {
                $scope.$emit(GANTT_EVENTS.COLUMN_DBL_CLICKED, Events.buildColumnEventData(evt, $element, $scope.column));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$emit(GANTT_EVENTS.COLUMN_CONTEXTMENU, Events.buildColumnEventData(evt, $element, $scope.column));
            });
        }]
    };
}]);
