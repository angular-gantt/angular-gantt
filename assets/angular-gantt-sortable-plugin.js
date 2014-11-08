/*
Project: angular-gantt for AngularJS
Author: Marco Schweighauser
Contributors: Rémi Alvergnat
License: MIT.
Github: https://github.com/angular-gantt/angular-gantt
*/
'use strict';

angular.module('gantt.sortable', ['gantt']).directive('ganttSortable', ['$document', function($document) {
    // Provides the row sort functionality to any Gantt row
    // Uses the sortableState to share the current row

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

            api.directives.on.new(scope, function(directiveName, rowScope, rowElement) {
                if (directiveName === 'ganttRowLabel') {
                    rowElement.bind('mousedown', function() {
                        if (!scope.enabled) {
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

                            if (targetRow !== undefined && scope.startRow !== undefined && targetRow !== scope.startRow) {
                                rowScope.$apply(function () {
                                    rowScope.row.rowsManager.moveRow(scope.startRow, targetRow);
                                });
                            }
                        }
                    });

                    var isInDragMode = function() {
                        return scope.startRow !== undefined && !angular.equals(rowScope.row, scope.startRow);
                    };

                    var enableDragMode = function() {
                        scope.startRow = rowScope.row;
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
                        scope.startRow = undefined;
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

//# sourceMappingURL=angular-gantt-sortable-plugin.js.map