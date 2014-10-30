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
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.header.$element = $element;

            $scope.getHeaderCss = function() {
                var css = {};

                if ($scope.ganttElementWidth - ($scope.showLabelsColumn ? $scope.labelsWidth : 0) > $scope.gantt.width) {
                    css.width = $scope.gantt.width + 'px';
                }

                return css;
            };
        }]
    };
}]);
