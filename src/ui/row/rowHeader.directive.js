'use strict';
gantt.directive('ganttRowHeader', [function() {
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
            $scope.gantt.rowHeader.$element = $element;

            $element.bind('mousedown', function(evt) {
                this.gantt.api.rowHeaders.raise.mousedown({evt: evt});
            });

            $element.bind('mouseup', function(evt) {
                this.gantt.api.rowHeaders.raise.mouseup({evt: evt});
            });

            $element.bind('click', function(evt) {
                this.gantt.api.rowHeaders.raise.click({evt: evt});
            });

            $element.bind('dblclick', function(evt) {
                this.gantt.api.rowHeaders.raise.dblclick({evt: evt});
            });

            $element.bind('contextmenu', function(evt) {
                this.gantt.api.rowHeaders.raise.contextmenu({evt: evt});
            });


        }]
    };
}]);
