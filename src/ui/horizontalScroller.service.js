gantt.directive('ganttHorizontalScrollReceiver', ['scroller', function (scroller) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            scroller.horizontal.push($element[0]);
        }]
    };
}]);