gantt.directive('ganttScrollSender', ['scroller', function (scroller) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            $scope.el = $element[0];
            $scope.updateListeners = function(e) {
                var i, l;

                for (i = 0, l = scroller.vertical.length; i < l; i++) {
                    scroller.vertical[i].style.top = -$scope.el.scrollTop + 'px';
                }

                for (i = 0, l = scroller.vertical.length; i < l; i++) {
                    scroller.horizontal[i].style.left = -$scope.el.scrollLeft + 'px';
                }
            };

            $element.bind('scroll', $scope.updateListeners);
        }]
    };
}]);