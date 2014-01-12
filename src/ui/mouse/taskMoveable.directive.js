gantt.directive('ganttTaskMoveable', ['$document', 'dateFunctions', 'mouseOffset', function ($document, df, mouseOffset) {

    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            var ganttBodyElement = $element.parent().parent();
            var moveOffset = null;
            var taskHasBeenMoved = false;

            $element.bind("mousedown", function (e) {
                var mode = getMode(e);
                if (mode !== "") {
                    enableMoveMode(mode, e);

                    var moveHandler = function(e) {
                        $scope.$apply(function() {

                            var date = getDate(e);
                            if (date !== undefined) {

                                if (mode === "M") {
                                    var newFromDate = df.addMilliseconds(date, -moveOffset, true);
                                    $scope.task.moveTo(newFromDate);
                                } else if (mode === "E") {
                                    if (date < $scope.task.from) {
                                        date = df.clone($scope.task.from);
                                    }

                                    $scope.task.setTo(date);

                                } else {
                                    if (date > $scope.task.to) {
                                        date = df.clone($scope.task.to);
                                    }

                                    $scope.task.setFrom(date);
                                }

                                taskHasBeenMoved = true;
                            }

                        });
                    };

                    ganttBodyElement.bind("mousemove", moveHandler);

                    var disableHandler = function () {
                        ganttBodyElement.unbind('mousemove', moveHandler);
                        angular.element($document[0].body).unbind('mouseup', disableHandler);
                        disableMoveMode();
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

            var getDate = function(e) {
                //var emPxFactor = ganttBodyElement[0].offsetWidth / $scope.gantw //$element[0].offsetWidth / $scope.task.width;
                var xInEm = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x / $scope.getPxToEmFactor();
                return $scope.task.row.gantt.getDateByPosition(xInEm);
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
                moveOffset = getDate(e) - $scope.task.from;

                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });
            };

            var disableMoveMode = function () {
                if (taskHasBeenMoved === true) {
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