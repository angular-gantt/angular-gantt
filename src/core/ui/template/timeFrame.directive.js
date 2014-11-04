'use strict';
gantt.directive('ganttTimeFrame', [function() {
    return {
        restrict: 'E',
        require: '^ganttColumn',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.timeFrame.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.timeFrame.$element = $element;

            $scope.getClass = function() {
                var classes = ['gantt-timeframe' + ($scope.timeFrame.working ? '' : '-non') + '-working'];

                if ($scope.timeFrame.classes) {
                    classes = classes.concat($scope.timeFrame.classes);
                }
                return classes;
            };

            $scope.gantt.api.directives.raise.new('ganttTimeFrame', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttTimeFrame', $scope, $element);
            });

        }]
    };
}]);
