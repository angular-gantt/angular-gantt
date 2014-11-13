'use strict';
gantt.directive('ganttLabelsHeader', [function() {
    return {
        restrict: 'E',
        require: '^ganttLabels',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.labelsHeader.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.api.directives.raise.new('ganttLabelsHeader', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttLabelsHeader', $scope, $element);
            });
        }]
    };
}]);
