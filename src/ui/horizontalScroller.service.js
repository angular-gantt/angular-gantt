gantt.directive('ganttHorizontalScrollReceiver', ['scroller', function (scroller) {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            scroller.horizontal.push($element[0]);
        }]
    };
}]);