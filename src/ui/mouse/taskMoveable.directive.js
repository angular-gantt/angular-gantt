gantt.directive('ganttTaskMoveable', ['$document', 'debounce', 'dateFunctions', 'mouseOffset', function ($document, debounce, df, mouseOffset) {

    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            var ganttBodyElement = $element.parent().parent();
            var ganttScrollElement = ganttBodyElement.parent().parent();
            var moveOffset = null;
            var taskHasBeenMoved = false;

            $element.bind("mousedown", function (e) {
                var mode = getMode(e);
                if (mode !== "") {
                    enableMoveMode(mode, e);

                    var moveHandler = debounce(function(e) {
                        var xInEm = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x / $scope.getPxToEmFactor();
                        if (mode === "M") {
                            var targetRow = getRow(e);
                            if (targetRow !== undefined && $scope.task.row.id !== targetRow.id) {
                                targetRow.moveTaskToRow($scope.task);
                            }

                            $scope.task.moveTo(xInEm - moveOffset);
                        } else if (mode === "E") {
                            $scope.task.setTo(xInEm);
                        } else {
                            $scope.task.setFrom(xInEm);
                        }

                        scrollIfNeeded();
                        taskHasBeenMoved = true;
                    }, 5);

                    ganttBodyElement.bind("mousemove", moveHandler);

                    var disableHandler = function () {
                        $scope.$apply(function() {
                            ganttBodyElement.unbind('mousemove', moveHandler);
                            angular.element($document[0].body).unbind('mouseup', disableHandler);
                            disableMoveMode();
                        });
                    };

                    angular.element($document[0].body).bind("mouseup", disableHandler);

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

            var scrollIfNeeded = function() {
                var leftBorder = ganttScrollElement[0].scrollLeft;
                var rightBorder = leftBorder + ganttScrollElement[0].offsetWidth;
                var distance = 20;

                var tLeft = $scope.task.left * $scope.getPxToEmFactor();
                var tRight = ($scope.task.left + $scope.task.width) * $scope.getPxToEmFactor();

                if (tLeft - leftBorder < distance) {
                    $scope.scrollTo(tLeft - distance);
                } else if (rightBorder - tRight < distance) {
                    $scope.scrollTo(tRight - ganttScrollElement[0].offsetWidth + distance);
                }
            };

            var getRow = function(e) {
                var y = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).y;
                var rowHeight = ganttBodyElement[0].offsetHeight / $scope.task.row.gantt.rows.length;
                var pos = Math.floor(y / rowHeight);
                return $scope.task.row.gantt.rows[pos];
            };

            var getMode = function (e) {
                var x = mouseOffset.getOffset(e).x;

                var distance = 0;

                // Define resize&move area. Make sure the move area does not get too small.
                if ($scope.allowTaskResizing) {
                    distance = $element[0].offsetWidth < 10 ? 3: 5;
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

                var xInEm = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x / $scope.getPxToEmFactor();
                moveOffset = xInEm - $scope.task.left;

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