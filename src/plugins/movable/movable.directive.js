'use strict';
gantt.directive('ganttMovable', ['ganttMouseButton', 'ganttMouseOffset', 'ganttDebounce', 'ganttSmartEvent', 'ganttMovableOptions', '$window', '$document', '$timeout',
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
                                    if (targetRow !== undefined && taskScope.task.row.id !== targetRow.id) {
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
