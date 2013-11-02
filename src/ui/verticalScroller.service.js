gantt.directive('ganttVerticalScrollReceiver', ['scroller', function (scroller) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            scroller.vertical.push($element[0]);
        }]
    };
}]);