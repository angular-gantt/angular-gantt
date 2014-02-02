gantt.directive('ganttTaskMoveable', ['$document', '$timeout', 'debounce', 'dateFunctions', 'mouseOffset', function ($document, $timeout, debounce, df, mouseOffset) {

    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            var resizeAreaWidthBig = 5;
            var resizeAreaWidthSmall = 3;
            var scrollSpeed = 15;
            var scrollTriggerDistance = 10;
            var bodyElement = angular.element($document[0].body);
            var ganttBodyElement = $element.parent().parent();
            var ganttScrollElement = ganttBodyElement.parent().parent();
            var taskHasBeenMoved = false;
            var mouseOffsetInEm = null;
            var moveStartX = null;

           $element.bind('mousedown', function (e) {
                var mode = getMode(e);
                if (mode !== "") {
                    enableMoveMode(mode, e);
                    e.preventDefault();
                }
            });

            $element.bind("mousemove", function (e) {
                var mode = getMode(e);
                if (mode !== "" && mode !== "M") {
                    $element.css("cursor", getCursor(mode));
                } else {
                    $element.css("cursor", '');
                }
            });

            var moveTask = function(mode, x, y) {
                if ($scope.task.isMoving === false) {
                    return;
                }

                var xInEm = x / $scope.getPxToEmFactor();
                if (mode === "M") {
                    var targetRow = getRow(y);
                    if (targetRow !== undefined && $scope.task.row.id !== targetRow.id) {
                        targetRow.moveTaskToRow($scope.task);
                    }

                    $scope.task.moveTo(xInEm - mouseOffsetInEm);
                } else if (mode === "E") {
                    $scope.task.setTo(xInEm);
                } else {
                    $scope.task.setFrom(xInEm);
                }

                taskHasBeenMoved = true;
                scrollIfNeeded(mode, x, y);
            };

            var scrollIfNeeded = function(mode, x, y) {
                var leftScreenBorder = ganttScrollElement[0].scrollLeft;

                if (x < moveStartX) {
                    // Scroll to the left
                    var taskLeft = $scope.task.left * $scope.getPxToEmFactor();

                    if (taskLeft - leftScreenBorder < scrollTriggerDistance && // Task touches left screen border
                        taskLeft  > 0 && // Task is still inside Gantt
                        leftScreenBorder - scrollSpeed > -scrollSpeed) { // Do not scroll if already reached the left side of the Gantt

                        $scope.scrollLeft(scrollSpeed);
                        $timeout(function() { moveTask(mode, x - scrollSpeed, y); }, 10, true); // Keep on scrolling
                    }
                } else {
                    // Scroll to the right
                    var screenWidth = ganttScrollElement[0].offsetWidth;
                    var rightScreenBorder = leftScreenBorder + screenWidth;
                    var ganttWidth = $scope.gantt.width * $scope.getPxToEmFactor();
                    var taskRight = ($scope.task.left + $scope.task.width) * $scope.getPxToEmFactor();

                    if (rightScreenBorder - taskRight < scrollTriggerDistance && // Task touches right screen border
                        taskRight < ganttWidth && // Task is still inside Gantt
                        rightScreenBorder + scrollSpeed < ganttWidth + scrollSpeed) { // Do not scroll if already reached the right side of the Gantt

                        $scope.scrollTo(taskRight - screenWidth + scrollSpeed);
                        $timeout(function() { moveTask(mode, x + scrollSpeed, y); }, 10, true); // Keep on scrolling
                    }
                }
            };

            var getRow = function(y) {
                var rowHeight = ganttBodyElement[0].offsetHeight / $scope.task.row.gantt.rows.length;
                var pos = Math.floor(y / rowHeight);
                return $scope.task.row.gantt.rows[pos];
            };

            var getMode = function (e) {
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
                } else if ($scope.allowTaskMoving && x >= distance && x <= $element[0].offsetWidth - distance) {
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

            var enableMoveMode = function (mode, e) {
                $scope.task.isMoving = true;

                moveStartX = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x;
                var xInEm = moveStartX / $scope.getPxToEmFactor();
                mouseOffsetInEm = xInEm - $scope.task.left;

                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });

                var taskMoveHandler = debounce(function(e) {
                    var pos = mouseOffset.getOffsetForElement(ganttBodyElement[0], e);
                    moveTask(mode, pos.x, pos.y);
                }, 5);
                ganttBodyElement.bind('mousemove', taskMoveHandler);

                bodyElement.one('mouseup', function() {
                    ganttBodyElement.unbind('mousemove', taskMoveHandler);
                    disableMoveMode();
                });
            };

            var disableMoveMode = function () {
                $scope.task.isMoving = false;

                if (taskHasBeenMoved === true) {
                    $scope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                    $scope.raiseTaskUpdatedEvent($scope.task);
                    taskHasBeenMoved = false;
                }

                $element.css("cursor", '');

                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });
            };
        }]
    };
}]);