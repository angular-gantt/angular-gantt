'use strict';
gantt.directive('ganttBody', [function() {
    return {
        restrict: 'E',
        require: '^gantt',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.body.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.body.$element = $element;
        }]
    };
}]);
