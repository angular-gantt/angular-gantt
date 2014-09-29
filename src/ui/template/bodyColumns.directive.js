'use strict';
gantt.directive('ganttBodyColumns', [function() {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bodyColumns.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', 'BodyColumns', function($scope, $element, BodyColumns) {
            $scope.template.body.columns = new BodyColumns($element);
        }]
    };
}]);
