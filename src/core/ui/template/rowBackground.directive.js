'use strict';
gantt.directive('ganttRowBackground', [function() {
    return {
        restrict: 'E',
        require: '^ganttBodyBackground',
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
            $scope.gantt.api.directives.raise.new('ganttRowBackground', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttRowBackground', $scope, $element);
            });
        }]
    };
}]);
