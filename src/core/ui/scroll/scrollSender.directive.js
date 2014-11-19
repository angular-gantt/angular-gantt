(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollSender', [function() {
        // Updates the element which are registered for the horizontal or vertical scroll event

        return {
            restrict: 'A',
            require: '^ganttScrollManager',
            controller: ['$scope', '$element', function($scope, $element) {
                var el = $element[0];

                var updateListeners = function() {
                    var i, l;

                    for (i = 0, l = $scope.scrollManager.vertical.length; i < l; i++) {
                        var vElement = $scope.scrollManager.vertical[i];
                        if (vElement.parentNode.scrollTop !== el.scrollTop) {
                            vElement.parentNode.scrollTop = el.scrollTop;
                        }
                    }

                    for (i = 0, l = $scope.scrollManager.horizontal.length; i < l; i++) {
                        var hElement = $scope.scrollManager.horizontal[i];
                        if (hElement.parentNode.scrollLeft !== el.scrollLeft) {
                            hElement.parentNode.scrollLeft  = el.scrollLeft;
                        }
                    }
                };

                $element.bind('scroll', updateListeners);

                $scope.$watch('bodyRowsWidth', function(newValue, oldValue) {
                    if (oldValue !== newValue) {
                        for (var i = 0, l = $scope.scrollManager.horizontal.length; i < l; i++) {
                            var hElement = $scope.scrollManager.horizontal[i];
                            hElement.style.width = newValue + 'px';
                        }
                    }
                });
            }]
        };
    }]);
}());

