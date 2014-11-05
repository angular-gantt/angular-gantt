'use strict';
gantt.directive('ganttTask', ['$window', '$document', '$timeout', '$filter', 'ganttSmartEvent', 'ganttDebounce', 'ganttMouseOffset', 'ganttMouseButton', function($window, $document, $timeout, $filter, smartEvent, debounce, mouseOffset, mouseButton) {
    return {
        restrict: 'E',
        require: '^ganttRow',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.task.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.task.$element = $element;

            var resizeAreaWidthBig = 5;
            var resizeAreaWidthSmall = 3;
            var scrollSpeed = 15;
            var scrollTriggerDistance = 5;

            var windowElement = angular.element($window);
            var ganttRowElement = $scope.row.$element;
            var ganttBodyElement = $scope.row.rowsManager.gantt.body.$element;
            var ganttScrollElement = $scope.row.rowsManager.gantt.scroll.$element;

            var taskHasBeenChanged = false;
            var mouseOffsetInEm;
            var moveStartX;
            var scrollInterval;

            $element.bind('mousedown', function(evt) {
                $scope.$apply(function() {
                    var mode = getMoveMode(evt);
                    if (mode !== '' && mouseButton.getButton(evt) === 1) {
                        var offsetX = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt).x;
                        enableMoveMode(mode, offsetX, evt);
                    }
                });
            });

            $element.bind('mousemove', debounce(function(e) {
                var mode = getMoveMode(e);
                if (mode !== '' && ($scope.task.isMoving || mode !== 'M')) {
                    $element.css('cursor', getCursor(mode));
                } else {
                    $element.css('cursor', '');
                }
            }, 5));

            var handleMove = function(mode, evt) {
                if ($scope.task.isMoving === false) {
                    return;
                }

                moveTask(mode, evt);
                scrollScreen(mode, evt);
            };

            var moveTask = function(mode, evt) {
                var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
                $scope.task.mouseOffsetX = mousePos.x;
                var x = mousePos.x;
                if (mode === 'M') {
                    if ($scope.allowTaskRowSwitching) {
                        var targetRow = getRowByY(mousePos.y);
                        if (targetRow !== undefined && $scope.task.row.id !== targetRow.id) {
                            targetRow.moveTaskToRow($scope.task);
                        }
                    }

                    if ($scope.allowTaskMoving) {
                        x = x - mouseOffsetInEm;
                        if ($scope.taskOutOfRange !== 'truncate') {
                            if (x < 0) {
                                x = 0;
                            } else if (x + $scope.task.width >= $scope.gantt.width) {
                                x = $scope.gantt.width - $scope.task.width;
                            }
                        }
                        $scope.task.moveTo(x);
                        $scope.row.rowsManager.gantt.api.tasks.raise.move($scope.task);
                    }
                } else if (mode === 'E') {
                    if ($scope.taskOutOfRange !== 'truncate') {
                        if (x < $scope.task.left) {
                            x = $scope.task.left;
                        } else if (x > $scope.gantt.width) {
                            x = $scope.gantt.width;
                        }
                    }
                    $scope.task.setTo(x);
                    $scope.row.rowsManager.gantt.api.tasks.raise.resize($scope.task);
                } else {
                    if ($scope.taskOutOfRange !== 'truncate') {
                        if (x > $scope.task.left + $scope.task.width) {
                            x = $scope.task.left + $scope.task.width;
                        } else if (x < 0) {
                            x = 0;
                        }
                    }
                    $scope.task.setFrom(x);
                    $scope.row.rowsManager.gantt.api.tasks.raise.resize($scope.task);
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
                        $scope.row.rowsManager.gantt.api.scroll.left(scrollSpeed);
                    }
                } else {
                    // Scroll to the right
                    var screenWidth = ganttScrollElement[0].offsetWidth;
                    var rightScreenBorder = leftScreenBorder + screenWidth;

                    if (mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                        mousePos.x += scrollSpeed;
                        keepOnScrolling = true;
                        $scope.row.rowsManager.gantt.api.scroll.right(scrollSpeed);
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
                    return $scope.task.row;
                } else {
                    var visibleRows = [];
                    angular.forEach($scope.task.row.rowsManager.rows, function(row) {
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
                if ($scope.allowTaskResizing) {
                    distance = $element[0].offsetWidth < 10 ? resizeAreaWidthSmall : resizeAreaWidthBig;
                }

                if ($scope.allowTaskResizing && x > $element[0].offsetWidth - distance) {
                    return 'E';
                } else if ($scope.allowTaskResizing && x < distance) {
                    return 'W';
                } else if (($scope.allowTaskMoving || $scope.allowTaskRowSwitching) && x >= distance && x <= $element[0].offsetWidth - distance) {
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
                if (!$scope.task.isMoving) {
                    if (mode === 'M') {
                        $scope.row.rowsManager.gantt.api.tasks.raise.moveBegin($scope.task);
                    } else {
                        $scope.row.rowsManager.gantt.api.tasks.raise.resizeBegin($scope.task);
                    }
                }

                // Init task move
                taskHasBeenChanged = false;
                $scope.task.moveMode = mode;
                $scope.task.isMoving = true;
                moveStartX = x;
                mouseOffsetInEm = x - $scope.task.modelLeft;

                // Add move event handlers
                var taskMoveHandler = debounce(function(evt) {
                    if ($scope.task.isMoving) {
                        // As this function is defered, disableMoveMode may have been called before.
                        // Without this check, task.changed event is not fired for faster moves.
                        // See github issue #190
                        clearScrollInterval();
                        handleMove(mode, evt);
                    }
                }, 5);
                smartEvent($scope, windowElement, 'mousemove', taskMoveHandler).bind();

                smartEvent($scope, windowElement, 'mouseup', function(evt) {
                    $scope.$apply(function() {
                        windowElement.unbind('mousemove', taskMoveHandler);
                        disableMoveMode(evt);
                    });
                }).bindOnce();

                // Show mouse move/resize cursor
                $element.css('cursor', getCursor(mode));
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });
            };

            var disableMoveMode = function() {
                $scope.task.isMoving = false;

                // Stop any active auto scroll
                clearScrollInterval();

                // Set mouse cursor back to default
                $element.css('cursor', '');
                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });

                // Raise move end event
                if ($scope.task.moveMode === 'M') {
                    $scope.row.rowsManager.gantt.api.tasks.raise.moveEnd($scope.task);
                } else {
                    $scope.row.rowsManager.gantt.api.tasks.raise.resizeEnd($scope.task);
                }

                $scope.task.moveMode = undefined;

                // Raise task changed event
                if (taskHasBeenChanged === true) {
                    taskHasBeenChanged = false;
                    $scope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                    $scope.row.rowsManager.gantt.api.tasks.raise.change($scope.task);
                }
            };

            if ($scope.task.isCreating) {
                delete $scope.task.isCreating;
                enableMoveMode('E', $scope.task.mouseOffsetX);
            } else if ($scope.task.isMoving) {
                // In case the task has been moved to another row a new controller is is created by angular.
                // Enable the move mode again if this was the case.
                enableMoveMode('M', $scope.task.mouseOffsetX);
            }

            $scope.gantt.api.directives.raise.new('ganttTask', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttTask', $scope, $element);
            });
        }]
    };
}]);
