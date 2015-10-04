(function(){
    'use strict';
    angular.module('gantt').service('ganttEnableNgAnimate', ['$injector', function($injector) {
        var ngAnimate;
        try {
            ngAnimate = $injector.get('$animate');
        } catch (e) {
        }

        if (ngAnimate !== undefined) {
            return function(enabled, element) {

                if (angular.version.major === 1 && angular.version.minor >= 4) {
                    ngAnimate.enabled(element,false);
                }
                else {
                    ngAnimate.enabled(false, element);
                }

            };
        } else {
            return function() {};
        }


    }]);
}());

