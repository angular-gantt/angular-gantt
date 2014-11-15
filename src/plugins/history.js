(function() {
    'use strict';
    angular.module('gantt.history', ['gantt', 'ngLodash']).directive('ganttHistory', ['moment', 'lodash', function(moment, _) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                var ganttScope = ganttCtrl.gantt.$scope;

                var pastStack = [];
                var futureStack = [];
                var undone = [];
                var redone = [];

                var comparator = function(a, b) {
                    var eq = _.isEqual(a, b, function(v1, v2) {
                        if (moment.isMoment(v1)) {
                            return v1.isSame(v2);
                        } else if (moment.isMoment(v2)) {
                            return v2.isSame(v1);
                        }
                    });
                    return eq;
                };

                var clone = function(value) {
                    var clo = _.cloneDeep(value, function(v) {
                        if (moment.isMoment(v)) {
                            return v.clone();
                        }
                    });
                    return clo;
                };

                var recorder = function(newVal, oldVal) {
                    if (newVal !== oldVal && redone.indexOf(newVal) === -1 && undone.indexOf(newVal) === -1) {
                        pastStack.push(oldVal);
                        futureStack = [];
                        undone = [];
                        redone = [];
                    }
                };

                ganttScope.$watch('data', recorder, comparator, clone);

                var undo = function() {
                    futureStack.unshift(ganttScope.data);
                    var data = pastStack.pop();
                    ganttScope.data = data;
                    undone.push(data);
                };

                var canUndo = function() {
                    return pastStack.length > 0;
                };

                var redo = function() {
                    pastStack.push(clone(ganttScope.data));
                    var data = futureStack.shift();
                    ganttScope.data = data;
                    redone.push(data);
                };

                var canRedo = function() {
                    return futureStack.length > 0;
                };

                var clear = function() {
                    pastStack = [];
                    futureStack = [];
                    undone = [];
                    redone = [];
                };

                api.registerMethod('history', 'undo', undo, this);
                api.registerMethod('history', 'canUndo', canUndo, this);
                api.registerMethod('history', 'redo', redo, this);
                api.registerMethod('history', 'canRedo', canRedo, this);
                api.registerMethod('history', 'clear', clear, this);
            }
        };
    }]);
}());
