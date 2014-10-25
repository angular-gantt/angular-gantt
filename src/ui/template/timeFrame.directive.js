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
        }]
    };
}]);
