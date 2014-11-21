(function(){
    'use strict';
    angular.module('gantt').directive('ganttVerticalScrollReceiver', function() {
        // The element with this attribute will scroll at the same time as the scrollSender element

        return {
            restrict: 'A',
            require: '^ganttScrollManager',
            link: function(scope, element, attrs, ganttScrollManagerCtrl) {
                ganttScrollManagerCtrl.registerVerticalReceiver(element);
            }
        };
    });
}());

