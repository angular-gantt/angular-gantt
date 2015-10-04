(function(){
    'use strict';
    angular.module('gantt').service('ganttEnableNgAnimate', ['$injector', function($injector) {
        var ngAnimate;
        try {
            ngAnimate = $injector.get('$animate');
        } catch (e) {
        }

        if (ngAnimate !== undefined) {
            return function(element, enabled) {
                if (angular.version.major >= 1 && angular.version.minor >= 4) {
                    // AngularJS 1.4 breaking change, arguments are flipped.
                    ngAnimate.enabled(element, enabled);
                } else {
                    ngAnimate.enabled(enabled, element);
                }

            };
        } else {
            return angular.noop;
        }


    }]);
}());

