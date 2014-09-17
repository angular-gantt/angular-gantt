gantt.directive('ganttVerticalScrollReceiver', function () {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: "A",
        require: "^scrollManager",
        controller: ['$scope', '$element', function ($scope, $element) {
            $scope.scrollManager.vertical.push($element[0]);
        }]
    };
});