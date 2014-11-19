(function() {
    'use strict';
    angular.module('gantt').service('ganttUtils', ['$document', function($document) {
        return {
            createBoundedWrapper: function(object, method) {
                return function() {
                    return method.apply(object, arguments);
                };
            },
            firstProperty: function(objects, propertyName, defaultValue) {
                for (var i = 0, l = objects.length; i < l; i++) {
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
                return $document[0].elementFromPoint(x, y);
            },
            elementsFromPoint: function(x, y, depth) {
                var elements = [], previousPointerEvents = [], cDepth = 0, current, i, l, d;

                // get all elements via elementFromPoint, and remove them from hit-testing in order
                while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null &&
                    (depth === undefined || cDepth < depth)) {

                    // push the element and its current style
                    elements.push(current);
                    previousPointerEvents.push({
                        value: current.style.getPropertyValue('pointer-events'),
                        priority: current.style.getPropertyPriority('pointer-events')
                    });

                    // add "pointer-events: none", to get to the underlying element
                    current.style.setProperty('pointer-events', 'none', 'important');

                    cDepth++;
                }

                // restore the previous pointer-events values
                for (i = 0, l = previousPointerEvents.length; i < l; i++) {
                    d = previousPointerEvents[i];
                    elements[i].style.setProperty('pointer-events', d.value ? d.value : '', d.priority);
                }

                return elements;
            },
            findElementFromPoint: function(x, y, checkFunction) {
                var elements = [], previousPointerEvents = [], cDepth = 0, current, found, i, l, d;

                // get all elements via elementFromPoint, and remove them from hit-testing in order
                while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null) {

                    // push the element and its current style
                    elements.push(current);
                    previousPointerEvents.push({
                        value: current.style.getPropertyValue('pointer-events'),
                        priority: current.style.getPropertyPriority('pointer-events')
                    });

                    // add "pointer-events: none", to get to the underlying element
                    current.style.setProperty('pointer-events', 'none', 'important');

                    cDepth++;

                    if (checkFunction(current)) {
                        found = current;
                        break;
                    }
                }

                // restore the previous pointer-events values
                for (i = 0, l = previousPointerEvents.length; i < l; i++) {
                    d = previousPointerEvents[i];
                    elements[i].style.setProperty('pointer-events', d.value ? d.value : '', d.priority);
                }

                return found;
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
}());

