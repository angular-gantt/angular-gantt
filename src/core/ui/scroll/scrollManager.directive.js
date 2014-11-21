(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollManager', function() {
        // The element with this attribute will scroll at the same time as the scrollSender element

        return {
            restrict: 'A',
            scope: {},
            controller: ['$scope', function($scope) {
                $scope.horizontal = [];
                $scope.vertical = [];

                this.registerVerticalReceiver = function (element) {
                    element.css('position', 'relative');
                    $scope.vertical.push(element[0]);
                };

                this.registerHorizontalReceiver = function (element) {
                    element.css('position', 'relative');
                    $scope.horizontal.push(element[0]);
                };

                this.getHorizontalRecievers = function() {
                    return $scope.horizontal;
                };

                this.getVerticalRecievers = function() {
                    return $scope.vertical;
                };
            }]
        };
    });
}());

