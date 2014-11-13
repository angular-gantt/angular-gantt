'use strict';
gantt.directive('ganttScrollSender', [function() {
    // Updates the element which are registered for the horizontal or vertical scroll event

    return {
        restrict: 'A',
        require: '^ganttScrollManager',
        controller: ['$scope', '$element', function($scope, $element) {
            var el = $element[0];
            var labelsWidth;
            var bodyRowsWidth;
            var bodyRowsHeight;

            var updateListeners = function() {
                var i, l;

                for (i = 0, l = $scope.scrollManager.vertical.length; i < l; i++) {
                    var vElement = $scope.scrollManager.vertical[i];
                    if (vElement.style.top !== -el.scrollTop) {
                        vElement.style.top = -el.scrollTop + 'px';
                    }
                }

                for (i = 0, l = $scope.scrollManager.horizontal.length; i < l; i++) {
                    var hElement = $scope.scrollManager.horizontal[i];
                    if (hElement.style.left !== -el.scrollLeft) {
                        hElement.style.left = -el.scrollLeft + 'px';
                        hElement.style.width = bodyRowsWidth + el.scrollLeft + 'px';
                    }
                }
            };

            $element.bind('scroll', updateListeners);

            $scope.$watchGroup(['labelsWidth', 'bodyRowsWidth', 'bodyRowsHeight'], function(newValues) {
                labelsWidth = newValues[0];
                bodyRowsWidth = newValues[1];
                bodyRowsHeight = newValues[2];

                updateListeners();
            });

        }]
    };
}]);
