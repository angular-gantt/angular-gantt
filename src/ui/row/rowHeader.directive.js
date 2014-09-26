'use strict';
gantt.directive('ganttRowHeader', ['Events', 'GANTT_EVENTS', function(Events, GANTT_EVENTS) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.rowHeader.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('mousedown', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_MOUSEDOWN, {evt: evt});
            });

            $element.bind('mouseup', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_MOUSEUP, {evt: evt});
            });

            $element.bind('click', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_CLICKED, {evt: evt});
            });

            $element.bind('dblclick', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_DBL_CLICKED, {evt: evt});
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_CONTEXTMENU, {evt: evt});
            });


        }]
    };
}]);
