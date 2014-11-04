/*
Project: angular-gantt for AngularJS
Author: Marco Schweighauser
Contributors: Rémi Alvergnat
License: MIT.
Github: https://github.com/angular-gantt/angular-gantt
*/
'use strict';

gantt.directive('ganttSortable', ['$document', function($document) {
    // Provides the row sort functionality to any Gantt row
    // Uses the sortableState to share the current row

    return {
        restrict: 'A',
        require: '^gantt',
        link: function(scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            if (ganttCtrl.pluginsData.sortable === undefined) {
                ganttCtrl.pluginsData.sortable = {};
            }
            var sortableData = ganttCtrl.pluginsData.sortable;

            var active = true;
            attrs.$observe('ganttSortable', function(value) {
                active = value !== false;
            });

            api.directives.on.new(scope, function(directiveName, rowScope, rowElement) {
                if (directiveName === 'ganttRowLabel') {
                    rowElement.bind('mousedown', function() {
                        if (active !== true) {
                            return;
                        }

                        enableDragMode();

                        var disableHandler = function() {
                            rowScope.$apply(function() {
                                angular.element($document[0].body).unbind('mouseup', disableHandler);
                                disableDragMode();
                            });
                        };
                        angular.element($document[0].body).bind('mouseup', disableHandler);
                    });

                    rowElement.bind('mousemove', function(e) {
                        if (isInDragMode()) {
                            var elementBelowMouse = $document[0].elementFromPoint(e.clientX, e.clientY);
                            elementBelowMouse = angular.element(elementBelowMouse);
                            var targetRow = elementBelowMouse.scope().row;

                            if (targetRow.id !== sortableData.startRow.id) {
                                rowScope.$apply(function () {
                                    rowScope.row.rowsManager.swapRows(targetRow, sortableData.startRow);
                                });
                            }
                        }
                    });

                    var isInDragMode = function() {
                        return sortableData.startRow !== undefined && !angular.equals(rowScope.row, sortableData.startRow);
                    };

                    var enableDragMode = function() {
                        sortableData.startRow = rowScope.row;
                        rowElement.css('cursor', 'move');
                        angular.element($document[0].body).css({
                            '-moz-user-select': '-moz-none',
                            '-webkit-user-select': 'none',
                            '-ms-user-select': 'none',
                            'user-select': 'none',
                            'cursor': 'no-drop'
                        });
                    };

                    var disableDragMode = function() {
                        sortableData.startRow = undefined;
                        rowElement.css('cursor', 'pointer');
                        angular.element($document[0].body).css({
                            '-moz-user-select': '',
                            '-webkit-user-select': '',
                            '-ms-user-select': '',
                            'user-select': '',
                            'cursor': 'auto'
                        });
                    };
                }
            });

        }
    };
}]);

//# sourceMappingURL=angular-gantt-plugins.js.map