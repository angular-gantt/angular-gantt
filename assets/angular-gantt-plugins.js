/*
Project: angular-gantt for AngularJS
Author: Marco Schweighauser
Contributors: Rémi Alvergnat
License: MIT.
Github: https://github.com/angular-gantt/angular-gantt
*/
'use strict';
angular.module('gantt.bounds.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/bounds/default.taskBounds.tmpl.html',
        '<div ng-show="bounds && isTaskMouseOver" class="gantt-task-bounds" ng-style="getCss()" ng-class="getClass()"></div>\n' +
        '');
}]);

angular.module('gantt.movable.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.progress.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/progress/default.taskProgress.tmpl.html',
        '<div ng-cloak class=\'gantt-task-progress\' ng-style="getCss()" ng-class="getClasses()"></div>\n' +
        '');
}]);

angular.module('gantt.sortable.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.tooltips.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/tooltips/default.tooltip.tmpl.html',
        '<div ng-show="showTooltips && visible" class="gantt-task-info" ng-cloak ng-style="css">\n' +
        '    <div class="gantt-task-info-content">\n' +
        '        {{ task.model.name }}</br>\n' +
        '        <small>\n' +
        '            {{\n' +
        '            task.isMilestone() === true && (getFromLabel()) || (getFromLabel() + \' - \' + getToLabel());\n' +
        '            }}\n' +
        '        </small>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
}]);


angular.module('gantt.bounds', ['gantt', 'gantt.bounds.templates']).directive('ganttBounds', ['moment', '$compile', function(moment, $compile) {
    return {
        restrict: 'E',
        require: '^gantt',
        link: function(scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                if (directiveName === 'ganttTask') {
                    taskElement.append($compile('<gantt-task-bounds></gantt-bounds>')(taskScope));
                }
            });

            api.tasks.on.clean(scope, function(model) {
                if (model.est !== undefined && !moment.isMoment(model.est)) {
                    model.est = moment(model.est);  //Earliest Start Time
                }
                if (model.lct !== undefined && !moment.isMoment(model.lct)) {
                    model.lct = moment(model.lct);  //Latest Completion Time
                }
            });
        }
    };
}]);


angular.module('gantt.movable', ['gantt']).directive('ganttMovable', ['ganttMouseButton', 'ganttMouseOffset', 'ganttDebounce', 'ganttSmartEvent', 'ganttMovableOptions', '$window', '$document', '$timeout',
    function(mouseButton, mouseOffset, debounce, smartEvent, movableOptions, $window, $document, $timeout) {
        // Provides moving and resizing of tasks
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                allowMoving: '=?',
                allowResizing: '=?',
                allowRowSwitching: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                api.registerEvent('tasks', 'move');
                api.registerEvent('tasks', 'moveBegin');
                api.registerEvent('tasks', 'moveEnd');
                api.registerEvent('tasks', 'resize');
                api.registerEvent('tasks', 'resizeBegin');
                api.registerEvent('tasks', 'resizeEnd');
                api.registerEvent('tasks', 'change');

                if (scope.options && typeof(scope.options.movable) === 'object') {
                    for (var option in scope.options.movable) {
                        scope[option] = scope.options[option];
                    }
                }

                movableOptions.initialize(scope);

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTask') {
                        var resizeAreaWidthBig = 5;
                        var resizeAreaWidthSmall = 3;
                        var scrollSpeed = 15;
                        var scrollTriggerDistance = 5;

                        var windowElement = angular.element($window);
                        var ganttRowElement = taskScope.row.$element;
                        var ganttBodyElement = taskScope.row.rowsManager.gantt.body.$element;
                        var ganttScrollElement = taskScope.row.rowsManager.gantt.scroll.$element;

                        var taskHasBeenChanged = false;
                        var mouseOffsetInEm;
                        var moveStartX;
                        var scrollInterval;

                        taskElement.bind('mousedown', function(evt) {
                            taskScope.$apply(function() {
                                var mode = getMoveMode(evt);
                                if (mode !== '' && mouseButton.getButton(evt) === 1) {
                                    var offsetX = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt).x;
                                    enableMoveMode(mode, offsetX, evt);
                                }
                            });
                        });

                        taskElement.bind('mousemove', debounce(function(e) {
                            var mode = getMoveMode(e);
                            if (mode !== '' && (taskScope.task.isMoving || mode !== 'M')) {
                                taskElement.css('cursor', getCursor(mode));
                            } else {
                                taskElement.css('cursor', '');
                            }
                        }, 5));

                        var handleMove = function(mode, evt) {
                            if (taskScope.task.isMoving === false) {
                                return;
                            }

                            moveTask(mode, evt);
                            scrollScreen(mode, evt);
                        };

                        var moveTask = function(mode, evt) {
                            var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
                            taskScope.task.mouseOffsetX = mousePos.x;
                            var x = mousePos.x;
                            if (mode === 'M') {
                                if (scope.allowRowSwitching) {
                                    var targetRow = getRowByY(mousePos.y);
                                    if (targetRow !== undefined && taskScope.task.row.model.id !== targetRow.model.id) {
                                        targetRow.moveTaskToRow(taskScope.task);
                                    }
                                }

                                if (scope.allowMoving) {
                                    x = x - mouseOffsetInEm;
                                    if (taskScope.taskOutOfRange !== 'truncate') {
                                        if (x < 0) {
                                            x = 0;
                                        } else if (x + taskScope.task.width >= taskScope.gantt.width) {
                                            x = taskScope.gantt.width - taskScope.task.width;
                                        }
                                    }
                                    taskScope.task.moveTo(x);
                                    taskScope.row.rowsManager.gantt.api.tasks.raise.move(taskScope.task);
                                }
                            } else if (mode === 'E') {
                                if (taskScope.taskOutOfRange !== 'truncate') {
                                    if (x < taskScope.task.left) {
                                        x = taskScope.task.left;
                                    } else if (x > taskScope.gantt.width) {
                                        x = taskScope.gantt.width;
                                    }
                                }
                                taskScope.task.setTo(x);
                                taskScope.row.rowsManager.gantt.api.tasks.raise.resize(taskScope.task);
                            } else {
                                if (taskScope.taskOutOfRange !== 'truncate') {
                                    if (x > taskScope.task.left + taskScope.task.width) {
                                        x = taskScope.task.left + taskScope.task.width;
                                    } else if (x < 0) {
                                        x = 0;
                                    }
                                }
                                taskScope.task.setFrom(x);
                                taskScope.row.rowsManager.gantt.api.tasks.raise.resize(taskScope.task);
                            }

                            taskHasBeenChanged = true;
                        };

                        var scrollScreen = function(mode, evt) {
                            var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
                            var leftScreenBorder = ganttScrollElement[0].scrollLeft;
                            var keepOnScrolling = false;

                            if (mousePos.x < moveStartX) {
                                // Scroll to the left
                                if (mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                                    mousePos.x -= scrollSpeed;
                                    keepOnScrolling = true;
                                    taskScope.row.rowsManager.gantt.api.scroll.left(scrollSpeed);
                                }
                            } else {
                                // Scroll to the right
                                var screenWidth = ganttScrollElement[0].offsetWidth;
                                var rightScreenBorder = leftScreenBorder + screenWidth;

                                if (mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                                    mousePos.x += scrollSpeed;
                                    keepOnScrolling = true;
                                    taskScope.row.rowsManager.gantt.api.scroll.right(scrollSpeed);
                                }
                            }

                            if (keepOnScrolling) {
                                scrollInterval = $timeout(function() {
                                    handleMove(mode, evt);
                                }, 100, true);
                            }
                        };

                        var clearScrollInterval = function() {
                            if (scrollInterval !== undefined) {
                                $timeout.cancel(scrollInterval);
                                scrollInterval = undefined;
                            }
                        };

                        var getRowByY = function(y) {
                            if (y >= ganttRowElement[0].offsetTop && y <= ganttRowElement[0].offsetTop + ganttRowElement[0].offsetHeight) {
                                return taskScope.task.row;
                            } else {
                                var visibleRows = [];
                                angular.forEach(taskScope.task.row.rowsManager.rows, function(row) {
                                    if (!row.hidden) {
                                        visibleRows.push(row);
                                    }
                                });
                                var rowHeight = ganttBodyElement[0].offsetHeight / visibleRows.length;
                                var pos = Math.floor(y / rowHeight);
                                return visibleRows[pos];
                            }
                        };

                        var getMoveMode = function(e) {
                            var x = mouseOffset.getOffset(e).x;

                            var distance = 0;

                            // Define resize&move area. Make sure the move area does not get too small.
                            if (scope.allowResizing) {
                                distance = taskElement[0].offsetWidth < 10 ? resizeAreaWidthSmall : resizeAreaWidthBig;
                            }

                            if (scope.allowResizing && x > taskElement[0].offsetWidth - distance) {
                                return 'E';
                            } else if (scope.allowResizing && x < distance) {
                                return 'W';
                            } else if ((scope.allowMoving || scope.allowRowSwitching) && x >= distance && x <= taskElement[0].offsetWidth - distance) {
                                return 'M';
                            } else {
                                return '';
                            }
                        };

                        var getCursor = function(mode) {
                            switch (mode) {
                                case 'E':
                                    return 'e-resize';
                                case 'W':
                                    return 'w-resize';
                                case 'M':
                                    return 'move';
                            }
                        };

                        var enableMoveMode = function(mode, x) {
                            // Raise task move start event
                            if (!taskScope.task.isMoving) {
                                if (mode === 'M') {
                                    taskScope.row.rowsManager.gantt.api.tasks.raise.moveBegin(taskScope.task);
                                } else {
                                    taskScope.row.rowsManager.gantt.api.tasks.raise.resizeBegin(taskScope.task);
                                }
                            }

                            // Init task move
                            taskHasBeenChanged = false;
                            taskScope.task.moveMode = mode;
                            taskScope.task.isMoving = true;
                            moveStartX = x;
                            mouseOffsetInEm = x - taskScope.task.modelLeft;

                            // Add move event handlers
                            var taskMoveHandler = debounce(function(evt) {
                                if (taskScope.task.isMoving) {
                                    // As this function is defered, disableMoveMode may have been called before.
                                    // Without this check, task.changed event is not fired for faster moves.
                                    // See github issue #190
                                    clearScrollInterval();
                                    handleMove(mode, evt);
                                }
                            }, 5);
                            smartEvent(taskScope, windowElement, 'mousemove', taskMoveHandler).bind();

                            smartEvent(taskScope, windowElement, 'mouseup', function(evt) {
                                taskScope.$apply(function() {
                                    windowElement.unbind('mousemove', taskMoveHandler);
                                    disableMoveMode(evt);
                                });
                            }).bindOnce();

                            // Show mouse move/resize cursor
                            taskElement.css('cursor', getCursor(mode));
                            angular.element($document[0].body).css({
                                '-moz-user-select': '-moz-none',
                                '-webkit-user-select': 'none',
                                '-ms-user-select': 'none',
                                'user-select': 'none',
                                'cursor': getCursor(mode)
                            });
                        };

                        var disableMoveMode = function() {
                            taskScope.task.isMoving = false;

                            // Stop any active auto scroll
                            clearScrollInterval();

                            // Set mouse cursor back to default
                            taskElement.css('cursor', '');
                            angular.element($document[0].body).css({
                                '-moz-user-select': '',
                                '-webkit-user-select': '',
                                '-ms-user-select': '',
                                'user-select': '',
                                'cursor': ''
                            });

                            // Raise move end event
                            if (taskScope.task.moveMode === 'M') {
                                taskScope.row.rowsManager.gantt.api.tasks.raise.moveEnd(taskScope.task);
                            } else {
                                taskScope.row.rowsManager.gantt.api.tasks.raise.resizeEnd(taskScope.task);
                            }

                            taskScope.task.moveMode = undefined;

                            // Raise task changed event
                            if (taskHasBeenChanged === true) {
                                taskHasBeenChanged = false;
                                taskScope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                                taskScope.row.rowsManager.gantt.api.tasks.raise.change(taskScope.task);
                            }
                        };

                        if (taskScope.task.isCreating) {
                            delete taskScope.task.isCreating;
                            enableMoveMode('E', taskScope.task.mouseOffsetX);
                        } else if (taskScope.task.isMoving) {
                            // In case the task has been moved to another row a new controller is is created by angular.
                            // Enable the move mode again if this was the case.
                            enableMoveMode('M', taskScope.task.mouseOffsetX);
                        }

                    }
                });

            }
        };
    }]);


angular.module('gantt.progress', ['gantt', 'gantt.progress.templates']).directive('ganttProgress', ['moment', '$compile', function(moment, $compile) {
    return {
        restrict: 'E',
        require: '^gantt',
        link: function(scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                if (directiveName === 'ganttTask') {
                    taskElement.append($compile('<gantt-task-progress ng-if="task.model.progress !== undefined"></gantt-task-progress>')(taskScope));
                }
            });

            api.tasks.on.clean(scope, function(model) {
                if (model.est !== undefined && !moment.isMoment(model.est)) {
                    model.est = moment(model.est); //Earliest Start Time
                }

                if (model.lct !== undefined && !moment.isMoment(model.lct)) {
                    model.lct = moment(model.lct); //Latest Completion Time
                }
            });
        }
    };
}]);


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


angular.module('gantt.tooltips', ['gantt', 'gantt.tooltips.templates']).directive('ganttTooltips', ['$compile', function($compile) {
    return {
        restrict: 'E',
        require: '^gantt',
        link: function(scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                if (directiveName === 'ganttTask') {
                    taskElement.append($compile('<gantt-tooltip ng-model="task"></gantt-tooltip>')(taskScope));
                }
            });
        }
    };
}]);


gantt.directive('ganttTaskBounds', [function() {
    // Displays a box representing the earliest allowable start time and latest completion time for a job

    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'plugins/bounds/default.taskBounds.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: true,
        controller: ['$scope', '$element', function($scope, $element) {
            var css = {};

            $scope.$watchGroup(['task.model.est', 'task.model.lct', 'task.left', 'task.width'], function() {
                if ($scope.task.model.est !== undefined && $scope.task.model.lct !== undefined) {
                    $scope.bounds = {};
                    $scope.bounds.left = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.model.est);
                    $scope.bounds.width = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.model.lct) - $scope.bounds.left;
                } else {
                    $scope.bounds = undefined;
                }
            });

            $scope.task.$element.bind('mouseenter', function() {
                $scope.$apply(function() {
                    $scope.isTaskMouseOver = true;
                });
            });

            $scope.task.$element.bind('mouseleave', function() {
                $scope.$apply(function() {
                    $scope.isTaskMouseOver = false;
                });
            });

            $scope.getCss = function() {
                if ($scope.bounds !== undefined) {
                    css.width = $scope.bounds.width + 'px';

                    if ($scope.task.isMilestone() === true || $scope.task.width === 0) {
                        css.left = ($scope.bounds.left - ($scope.task.left - 0.3)) + 'px';
                    } else {
                        css.left = ($scope.bounds.left - $scope.task.left) + 'px';
                    }
                }

                return css;
            };

            $scope.getClass = function() {
                if ($scope.task.model.est === undefined || $scope.task.model.lct === undefined) {
                    return 'gantt-task-bounds-in';
                } else if ($scope.task.model.est > $scope.task.model.from) {
                    return 'gantt-task-bounds-out';
                }
                else if ($scope.task.model.lct < $scope.task.model.to) {
                    return 'gantt-task-bounds-out';
                }
                else {
                    return 'gantt-task-bounds-in';
                }
            };

            $scope.task.rowsManager.gantt.api.directives.raise.new('ganttBounds', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttBounds', $scope, $element);
            });
        }]
    };
}]);


angular.module('gantt.movable').factory('ganttMovableOptions', [function() {
    return {
        initialize: function(options) {

            options.allowMoving = options.allowMoving !== undefined ? !!options.allowMoving : true;
            options.allowResizing = options.allowResizing !== undefined ? !!options.allowResizing : true;
            options.allowRowSwitching = options.allowRowSwitching !== undefined ? !!options.allowRowSwitching : true;

            return options;
        }
    };
}]);


gantt.directive('ganttTaskProgress', [function() {
    return {
        restrict: 'E',
        requires: '^ganttTask',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'plugins/progress/default.taskProgress.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: true,
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.getClasses = function() {
                var classes = [];

                if ($scope.task.model.progress !== undefined && (typeof($scope.task.model.progress) !== 'object')) {
                    classes = $scope.task.model.classes;
                }

                return classes;
            };

            $scope.getCss = function() {
                var css = {};

                var progress;
                if ($scope.task.model.progress !== undefined) {
                    if (typeof($scope.task.model.progress) === 'object') {
                        progress = $scope.task.model.progress;
                    } else {
                        progress = {percent: $scope.task.model.progress};
                    }
                }

                if (progress) {
                    if (progress.color) {
                        css['background-color'] = progress.color;
                    } else {
                        css['background-color'] = '#6BC443';
                    }

                    css.width = progress.percent + '%';
                }

                return css;
            };

            $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskProgress', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskProgress', $scope, $element);
            });
        }]
    };
}]);


angular.module('gantt.tooltips').directive('ganttTooltip', ['$timeout', '$document', 'ganttDebounce', 'ganttSmartEvent', function($timeout, $document, debounce, smartEvent) {
    // This tooltip displays more information about a task

    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'plugins/tooltips/default.tooltip.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        scope: true,
        replace: true,
        controller: ['$scope', '$element', function($scope, $element) {
            var bodyElement = angular.element($document[0].body);
            var parentElement = $element.parent();
            var showTooltipPromise;
            var mousePositionX;

            $scope.css = {};
            $scope.visible = false;

            $scope.getFromLabel = function() {
                return $scope.task.model.from.format($scope.task.rowsManager.gantt.$scope.tooltipDateFormat);
            };

            $scope.getToLabel = function() {
                return $scope.task.model.to.format($scope.task.rowsManager.gantt.$scope.tooltipDateFormat);
            };

            $scope.$watch('isTaskMouseOver', function(newValue) {
                if (showTooltipPromise) {
                    $timeout.cancel(showTooltipPromise);
                }
                if (newValue === true) {
                    showTooltipPromise = $timeout(function() {
                        showTooltip(mousePositionX);
                    }, 500, true);
                } else {
                    if (!$scope.task.isMoving) {
                        hideTooltip();
                    }
                }
            });

            $scope.task.$element.bind('mousemove', function(evt) {
                mousePositionX = evt.clientX;
            });

            $scope.task.$element.bind('mouseenter', function(evt) {
                $scope.$apply(function() {
                    $scope.mouseEnterX = evt.clientX;
                    $scope.isTaskMouseOver = true;
                });
            });

            $scope.task.$element.bind('mouseleave', function() {
                $scope.$apply(function() {
                    $scope.mouseEnterX = undefined;
                    $scope.isTaskMouseOver = false;
                });
            });

            var mouseMoveHandler = smartEvent($scope, bodyElement, 'mousemove', debounce(function(e) {
                updateTooltip(e.clientX);
            }, 5, false));

            $scope.$watch('task.isMoving', function(newValue) {
                if (newValue === true) {
                    mouseMoveHandler.bind();
                } else if (newValue === false) {
                    mouseMoveHandler.unbind();
                    hideTooltip();
                }
            });

            var getViewPortWidth = function() {
                var d = $document[0];
                return d.documentElement.clientWidth || d.documentElement.getElementById('body')[0].clientWidth;
            };

            var showTooltip = function(x) {
                $scope.visible = true;

                $timeout(function() {
                    updateTooltip(x);

                    $scope.css.top = parentElement[0].getBoundingClientRect().top + 'px';
                    $scope.css.marginTop = -$element[0].offsetHeight - 8 + 'px';
                    $scope.css.opacity = 1;
                }, 0, true);
            };

            var updateTooltip = function(x) {
                // Check if info is overlapping with view port
                if (x + $element[0].offsetWidth > getViewPortWidth()) {
                    $scope.css.left = (x + 20 - $element[0].offsetWidth) + 'px';
                    $element.addClass('gantt-task-infoArrowR'); // Right aligned info
                    $element.removeClass('gantt-task-infoArrow');
                } else {
                    $scope.css.left = (x - 20) + 'px';
                    $element.addClass('gantt-task-infoArrow');
                    $element.removeClass('gantt-task-infoArrowR');
                }
            };

            var hideTooltip = function() {
                $scope.css.opacity = 0;
                $scope.visible = false;
            };

            $scope.gantt.api.directives.raise.new('ganttTooltip', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttTooltip', $scope, $element);
            });
        }]
    };
}]);

//# sourceMappingURL=angular-gantt-plugins.js.map