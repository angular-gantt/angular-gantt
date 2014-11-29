(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollSender', [function() {
        // Updates the element which are registered for the horizontal or vertical scroll event

        return {
            restrict: 'A',
            require: ['^gantt', '^ganttScrollManager'],
            link: function(scope, element, attrs, controllers) {
                var el = element[0];

                var updateListeners = function() {
                    var i, l;

                    var vertical = controllers[1].getVerticalRecievers();
                    for (i = 0, l = vertical.length; i < l; i++) {
                        var vElement = vertical[i];
                        if (vElement.parentNode.scrollTop !== el.scrollTop) {
                            vElement.parentNode.scrollTop = el.scrollTop;
                        }
                    }

                    var horizontal = controllers[1].getHorizontalRecievers();
                    for (i = 0, l = horizontal.length; i < l; i++) {
                        var hElement = horizontal[i];
                        if (hElement.parentNode.scrollLeft !== el.scrollLeft) {
                            hElement.parentNode.scrollLeft  = el.scrollLeft;
                        }
                    }
                };

                element.bind('scroll', updateListeners);

                scope.$watch(function() {
                    return controllers[0].gantt.width;
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var horizontal = controllers[1].getHorizontalRecievers();
                        for (var i = 0, l = horizontal.length; i < l; i++) {
                            var hElement = horizontal[i];
                            hElement.style.width = newValue + 'px';
                        }
                    }
                });
            }
        };
    }]);
}());

