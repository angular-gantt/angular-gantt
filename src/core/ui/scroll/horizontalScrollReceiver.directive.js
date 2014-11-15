(function(){
    'use strict';
    angular.module('gantt').directive('ganttHorizontalScrollReceiver', function() {
        // The element with this attribute will scroll at the same time as the scrollSender element

        return {
            restrict: 'A',
            require: '^ganttScrollManager',
            controller: ['$scope', '$element', function($scope, $element) {
                $scope.scrollManager.registerHorizontalReceiver($element);
            }]
        };
    });
}());
