'use strict';
gantt.directive('ganttScrollManager', function() {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: 'A',
        controller: ['$scope', function($scope) {
            $scope.scrollManager = {
                horizontal: [],
                vertical: [],

                registerVerticalReceiver: function (element) {
                    element.css('position', 'relative');
                    $scope.scrollManager.vertical.push(element[0]);
                },

                registerHorizontalReceiver: function (element) {
                    element.css('position', 'relative');
                    $scope.scrollManager.horizontal.push(element[0]);
                }
            };
        }]
    };
});
