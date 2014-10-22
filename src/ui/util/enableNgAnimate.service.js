'use strict';
gantt.service('enableNgAnimate', ['$injector', function($injector) {
    var ngAnimate;
    try {
        ngAnimate = $injector.get('$animate');
    } catch (e) {
    }

    if (ngAnimate !== undefined) {
        return function(enabled, element) {
            ngAnimate.enabled(false, element);
        };
    } else {
        return function() {};
    }


}]);
