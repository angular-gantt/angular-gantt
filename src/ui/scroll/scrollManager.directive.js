gantt.directive('gantScrollManager', function () {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: "A",
        controller: ['$scope', function($scope){
            $scope.scrollManager = {
                horizontal: [],
                vertical: []
            }
        }]
    };
});