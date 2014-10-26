'use strict';
gantt.directive('ganttElementWidthListener', [function() {
    // Updates the limit filters if the user scrolls the gantt chart

    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            var scopeVariable = $attrs.ganttElementWidthListener;
            if (scopeVariable === '') {
                scopeVariable = 'elementWidth';
            }

            $scope.$watch(function() {
               $scope[scopeVariable] = $element.outerWidth();
            });
        }]
    };
}]);
