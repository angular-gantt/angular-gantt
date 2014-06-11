gantt.directive('ganttTaskDrag',['Gantt', 'DroppableTask', function (Gantt, DroppableTask) {

    return {
        restrict: "E",
        templateUrl: function (tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return "template/gantt.task.drag.tmpl.html";
            } else {
                return tAttrs.templateUrl;
            }
        },
        scope:{
            task:'='
        },
        replace: true,
        controller: ['$scope', '$element', '$timeout',  '$window', 'debounce', 'mouseOffset', 'smartEvent', function ($scope, $element, $timeout, $window, debounce, mouseOffset, smartEvent) {
            var ganttScope;
            var ganttBodyElement, ganttScrollElement;
            var windowElement = angular.element($window);
            var taskMoveHandler;
            var scrollInterval;
            var scrollSpeed = 15;
            var scrollTriggerDistance = 5;

            $scope.dragActive = false;
            $scope.onStart = function(){
                $scope.dragActive = true;
                var duration;
                console.log('onStart', $scope.task);
                if(!angular.isDefined($scope.task.from)){
                    $scope.task.from = Gantt.getDateRange().from;
                }
                if(!angular.isDefined($scope.task.to)) {
                    duration = $scope.task.duration;
                    if (!angular.isDefined(duration)) {
                        $scope.task.duration = 240;
                    }
                    $scope.task.to = new Date($scope.task.from.getTime() + $scope.task.duration * 60 * 1000);
                    duration = $scope.task.duration;
                }

                $scope.task = new DroppableTask($scope.task.id, /*{gantt: Gantt},*/ $scope.task.subject, $scope.task.color, $scope.task.classes, $scope.task.priority, $scope.task.from, $scope.task.to, $scope.task.data, undefined, undefined);
                $scope.task.duration = duration;
                //angular.copy('after', $scope.task);
                $scope.task.updatePosAndSize();
            };
            $scope.onStop = function(event, ui){
                $scope.dragActive = false;
                if(angular.isDefined(taskMoveHandler)){
                    windowElement.unbind('mousemove', taskMoveHandler);
                    disableMoveMode();
                }


                console.log('onStop');
            };
            $scope.jqyouiOptions = {
                revert: 'invalid',
                cursorAt:{left:0, top:5},
                scroll: false
            };

            var setGanttBodyElement = function(){
                if(!angular.isDefined(ganttBodyElement)){
                    var windowElement = angular.element($window.document.body);
                    ganttBodyElement = windowElement.find('.gantt');
                    ganttScrollElement = ganttBodyElement.parent().parent();
                }
            };

            var clearScrollInterval = function() {
                if (scrollInterval !== undefined) {
                    $timeout.cancel(scrollInterval);
                    scrollInterval = undefined;
                }
            };

            var scrollScreen = function(mode, mousePos) {
                var leftScreenBorder = ganttScrollElement[0].scrollLeft;
                var keepOnScrolling = false;

                if (mousePos.x < moveStartX) {
                    // Scroll to the left
                    if (mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                        mousePos.x -= scrollSpeed;
                        keepOnScrolling = true;
                        ganttScope.scrollLeft(scrollSpeed);
                    }
                } else {
                    // Scroll to the right
                    var screenWidth = ganttScrollElement[0].offsetWidth;
                    var rightScreenBorder = leftScreenBorder + screenWidth;

                    if (mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                        mousePos.x += scrollSpeed;
                        keepOnScrolling = true;
                        ganttScope.scrollRight(scrollSpeed);
                    }
                }

                if (keepOnScrolling) {
                    scrollInterval = $timeout(function() { handleMove(mode, mousePos); }, 100, true);
                }
            };

            var handleMove = function(mode, mousePos) {
                scrollScreen(mode, mousePos);
            };

            var enableMoveMode = function (mode, x) {
//                // Raise task move start event
//                if(!$scope.task.isMoving) {
//                    if (mode === "M")
//                        $scope.raiseTaskMoveStartEvent($scope.task);
//                    else
//                        $scope.raiseTaskResizeStartEvent($scope.task);
//                }

                // Init task move
//                taskHasBeenChanged = false;
//                $scope.task.moveMode = mode;
//                $scope.task.isMoving = true;
                moveStartX = x;
                var xInEm = moveStartX / ganttScope.getPxToEmFactor();
                mouseOffsetInEm = xInEm - $scope.task.left;

                // Add move event handlers
                taskMoveHandler = debounce(function(e) {
                    var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], e);
                    clearScrollInterval();
                    handleMove(mode, mousePos);
                }, 5);
                smartEvent($scope, windowElement, 'mousemove', taskMoveHandler).bind();

                smartEvent($scope, windowElement, 'mouseup', function() {
                    $scope.$apply(function() {
                        windowElement.unbind('mousemove', taskMoveHandler);
                        disableMoveMode();
                    });
                }).bindOnce();
            };

            var disableMoveMode = function () {
                // Stop any active auto scroll
                clearScrollInterval();

                $scope.task.modeMode = null;
            };

            $scope.enableScroll = function (event, ganttDirectiveScope) {
                ganttScope = ganttDirectiveScope;
                setGanttBodyElement();
                var offsetX = mouseOffset.getOffsetForElement(ganttBodyElement[0], event).x;
                enableMoveMode("M", offsetX);
            };


        }]
    };
}]);
gantt.directive('ganttTask', ['$window', '$document', '$timeout', 'smartEvent', 'debounce', 'dateFunctions', 'mouseOffset', 'mouseButton', 'Gantt', function ($window, $document, $timeout, smartEvent, debounce, df, mouseOffset, mouseButton, Gantt) {

    return {
        restrict: "E",
        templateUrl: function (tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return "template/gantt.task.tmpl.html";
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        controller: ['$scope', '$element', function ($scope, $element) {
            var resizeAreaWidthBig = 5;
            var resizeAreaWidthSmall = 3;
            var scrollSpeed = 15;
            var scrollTriggerDistance = 5;

            var windowElement = angular.element($window);
            var ganttBodyElement = $element.parent().parent();
            var ganttScrollElement = ganttBodyElement.parent().parent();
            var taskHasBeenChanged = false;
            var mouseOffsetInEm;
            var moveStartX;
            var scrollInterval;

            $element.bind('mousedown', function (e) {
                $scope.$apply(function() {
                    var mode = getMoveMode(e);
                    if (mode !== "" && mouseButton.getButton(e) === 1) {
                        var offsetX = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x;
                        enableMoveMode(mode, offsetX);
                    }
                });
            });

            $element.bind('click', function (e) {
                $scope.$apply(function() {
                    // Only raise click event if there was no task update event
                    if (!taskHasBeenChanged) {
                        $scope.raiseTaskClickedEvent(e, $scope.task);
                    }

                    e.stopPropagation();
                });
            });

            $element.bind('dblclick', function (e) {
                $scope.$apply(function() {
                    // Only raise dbl click event if there was no task update event
                    if (!taskHasBeenChanged) {
                        $scope.raiseTaskDblClickedEvent(e, $scope.task);
                    }

                    e.stopPropagation();
                });
            });

            $element.bind('contextmenu', function (e) {
                $scope.$apply(function() {
                    // Only raise click event if there was no task update event
                    if (!taskHasBeenChanged) {
                        $scope.raiseTaskContextMenuEvent(e, $scope.task);
                    }

                    e.stopPropagation();
                });
            });

            $element.bind("mousemove", debounce(function (e) {
                var mode = getMoveMode(e);
                if (mode !== "" && mode !== "M") {
                    $element.css("cursor", getCursor(mode));
                } else {
                    $element.css("cursor", '');
                }

                $scope.task.mouseX = e.clientX;
            }, 5));

            $element.bind('mouseenter', function (e) {
                $scope.$apply(function() {
                    $scope.task.mouseX = e.clientX;
                    $scope.task.isMouseOver = true;
                });
            });

            $element.bind('mouseleave', function () {
                $scope.$apply(function() {
                    $scope.task.isMouseOver = false;
                });
            });

            var handleMove = function(mode, mousePos) {
                if ($scope.task.isMoving === false) {
                    return;
                }

                moveTask(mode, mousePos);
                scrollScreen(mode, mousePos);
            };

            var moveTask = function(mode, mousePos) {
                $scope.task.mouseOffsetX = mousePos.x;
                var xInEm = mousePos.x / $scope.getPxToEmFactor();
                if (mode === "M") {
                    if ($scope.allowTaskRowSwitching) {
                        var targetRow = getRowByY(mousePos.y);
                        if (targetRow !== undefined && $scope.task.row.id !== targetRow.id) {
                            targetRow.moveTaskToRow($scope.task);
                        }
                    }

                    if ($scope.allowTaskMoving) {
                        $scope.task.moveTo(xInEm - mouseOffsetInEm);
                    }
                } else if (mode === "E") {
                    $scope.task.setTo(xInEm);
                } else {
                    $scope.task.setFrom(xInEm);
                }

                taskHasBeenChanged = true;
            };

            var scrollScreen = function(mode, mousePos) {
                var leftScreenBorder = ganttScrollElement[0].scrollLeft;
                var keepOnScrolling = false;

                if (mousePos.x < moveStartX) {
                    // Scroll to the left
                    if (mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                        mousePos.x -= scrollSpeed;
                        keepOnScrolling = true;
                        $scope.scrollLeft(scrollSpeed);
                    }
                } else {
                    // Scroll to the right
                    var screenWidth = ganttScrollElement[0].offsetWidth;
                    var rightScreenBorder = leftScreenBorder + screenWidth;

                    if (mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                        mousePos.x += scrollSpeed;
                        keepOnScrolling = true;
                        $scope.scrollRight(scrollSpeed);
                    }
                }

                if (keepOnScrolling) {
                    scrollInterval = $timeout(function() { handleMove(mode, mousePos); }, 100, true);
                }
            };

            var clearScrollInterval = function() {
                if (scrollInterval !== undefined) {
                    $timeout.cancel(scrollInterval);
                    scrollInterval = undefined;
                }
            };

            var getRowByY = function(y) {
                var rowHeight = ganttBodyElement[0].offsetHeight / Gantt.rows.length;
                var pos = Math.floor(y / rowHeight);
                return Gantt.rows[pos];
            };

            var getMoveMode = function (e) {
                var x = mouseOffset.getOffset(e).x;

                var distance = 0;

                // Define resize&move area. Make sure the move area does not get too small.
                if ($scope.allowTaskResizing) {
                    distance = $element[0].offsetWidth < 10 ? resizeAreaWidthSmall: resizeAreaWidthBig;
                }

                if ($scope.allowTaskResizing && x > $element[0].offsetWidth - distance) {
                    return "E";
                } else if ($scope.allowTaskResizing && x < distance) {
                    return "W";
                } else if (($scope.allowTaskMoving || $scope.allowTaskRowSwitching) && x >= distance && x <= $element[0].offsetWidth - distance) {
                    return "M";
                } else {
                    return "";
                }
            };

            var getCursor = function(mode) {
                switch(mode) {
                    case "E": return 'e-resize';
                    case "W": return 'w-resize';
                    case "M": return 'move';
                }
            };

            var enableMoveMode = function (mode, x) {
                // Raise task move start event
                if(!$scope.task.isMoving) {
                    if (mode === "M")
                        $scope.raiseTaskMoveStartEvent($scope.task);
                    else
                        $scope.raiseTaskResizeStartEvent($scope.task);
                }

                // Init task move
                taskHasBeenChanged = false;
                $scope.task.moveMode = mode;
                $scope.task.isMoving = true;
                moveStartX = x;
                var xInEm = moveStartX / $scope.getPxToEmFactor();
                mouseOffsetInEm = xInEm - $scope.task.left;

                // Add move event handlers
                var taskMoveHandler = debounce(function(e) {
                    var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], e);
                    clearScrollInterval();
                    handleMove(mode, mousePos);
                }, 5);
                smartEvent($scope, windowElement, 'mousemove', taskMoveHandler).bind();

                smartEvent($scope, windowElement, 'mouseup', function() {
                    $scope.$apply(function() {
                        windowElement.unbind('mousemove', taskMoveHandler);
                        disableMoveMode();
                    });
                }).bindOnce();

                // Show mouse move/resize cursor
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });
            };

            var disableMoveMode = function () {
                $scope.task.isMoving = false;

                // Stop any active auto scroll
                clearScrollInterval();

                // Set mouse cursor back to default
                $element.css("cursor", '');
                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });

                // Raise move end event
                if($scope.task.moveMode==="M")
                    $scope.raiseTaskMoveEndEvent($scope.task);
                else
                    $scope.raiseTaskResizeEndEvent($scope.task);

                $scope.task.modeMode = null;

                // Raise task changed event
                if (taskHasBeenChanged === true) {
                    $scope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                    $scope.raiseTaskUpdatedEvent($scope.task, true);
                }
            };

            // In case the task has been moved to another row a new controller is is created by angular.
            // Enable the move mode again if this was the case.
            if ($scope.task.isMoving) {
                enableMoveMode("M", $scope.task.mouseOffsetX);
            }
        }]
    };
}]);