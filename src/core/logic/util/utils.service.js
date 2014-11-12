'use strict';
gantt.service('ganttUtils', ['$document', function($document) {
    return {
        createBoundedWrapper: function(object, method) {
            return function() {
                return method.apply(object, arguments);
            };
        },
        firstProperty: function(objects, propertyName, defaultValue) {
            for (var i= 0, l=objects.length; i<l; i++) {
                var object = objects[i];
                if (object !== undefined && propertyName in object) {
                    if (object[propertyName] !== undefined) {
                        return object[propertyName];
                    }
                }
            }
            return defaultValue;
        },
        elementFromPoint: function(x, y) {
            var element = $document[0].elementFromPoint(x, y);
            return angular.element(element);
        },
        scopeFromPoint: function(x, y) {
            var element = this.elementFromPoint(x, y);
            if (element !== undefined) {
                return element.scope();
            }
        },
        random4: function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        },
        randomUuid: function() {
            return this.random4() + this.random4() + '-' + this.random4() + '-' + this.random4() + '-' +
                this.random4() + '-' + this.random4() + this.random4() + this.random4();
        },
        newId: (function() {
            var seedId = new Date().getTime();
            return function() {
                return seedId += 1;
            };
        })()
    };
}]);
