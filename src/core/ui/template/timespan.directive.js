'use strict';
gantt.directive('ganttTimespan', [function() {
    return {
        restrict: 'E',
        require: '^ganttRow',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.timespan.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.timespan.$element = $element;

            $scope.gantt.api.directives.raise.new('ganttTimespan', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttTimespan', $scope, $element);
            });
        }]
    };
}]);
