'use strict';
gantt.directive('ganttBodyBackground', [function() {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bodyBackground.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.body.background.$element = $element;

            $scope.gantt.api.directives.raise.new('ganttBodyBackground', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttBodyBackground', $scope, $element);
            });
        }]
    };
}]);
