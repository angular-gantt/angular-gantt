gantt.directive('ganttHorizontalScrollReceiver', ['scrollManager', function (scrollManager) {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            scrollManager.horizontal.push($element[0]);
        }]
    };
}]);