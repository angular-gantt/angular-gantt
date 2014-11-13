'use strict';
gantt.directive('ganttBodyForeground', [function() {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bodyForeground.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.body.foreground.$element = $element;

            $scope.gantt.api.directives.raise.new('ganttBodyForeground', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttBodyForeground', $scope, $element);
            });
        }]
    };
}]);
