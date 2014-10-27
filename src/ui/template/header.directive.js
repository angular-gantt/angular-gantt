'use strict';
gantt.directive('ganttHeader', [function() {
    return {
        restrict: 'E',
        require: '^gantt',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.header.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', 'GanttHeader', function($scope, $element, Header) {
            $scope.template.header = new Header($element);

            $scope.getHeaderStyle = function() {
                var css = {};

                if ($scope.ganttElementWidth - $scope.labelsWidth > $scope.gantt.width) {
                    css.width = $scope.gantt.width + 'px';
                }

                return css;
            };
        }]
    };
}]);
