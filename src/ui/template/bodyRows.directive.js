'use strict';
gantt.directive('ganttBodyRows', [function() {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bodyRows.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', 'BodyRows', function($scope, $element, BodyRows) {
            $scope.template.body.rows = new BodyRows($element);
        }]
    };
}]);
