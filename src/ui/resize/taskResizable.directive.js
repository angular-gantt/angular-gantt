gantt.directive('ganttTaskResizable', ['$document', 'dateFunctions', 'mouseOffset', function ($document, df, mouseOffset) {

    return {
        restrict: "A",
        scope: { task: "=ganttTaskResizable", onTaskResized: "&taskResized" },
        controller: ['$scope', '$element', function ($scope, $element) {
            var ganttBodyElement = $element.parent().parent();
            var taskHasBeenResized = false;

            $element.bind("mousedown", function (e) {
                var mode = getMode(e);
                if (mode !== "") {
                    enableResizeMode(mode);

                    var moveHandler = function(e) {
                        $scope.$apply(function() {
                            var date = getDate(e);

                            if (date !== undefined) {
                                if (mode === "E") {
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

                                taskHasBeenResized = true;
                            }
                        });
                    };

                    ganttBodyElement.bind("mousemove", moveHandler);

                    var disableHandler = function () {
                        ganttBodyElement.unbind('mousemove', moveHandler);
                        angular.element($document[0].body).unbind('mouseup', disableHandler);
                        disableResizeMode();
                    };

                    angular.element($document[0].body).bind("mouseup", disableHandler);

                    e.preventDefault();
                }
            });

            $element.bind("mousemove", function (e) {
                var mode = getMode(e);

                if (mode !== "") {
                    $element.css("cursor", getCursor(mode));
                } else {
                    $element.css("cursor", '');
                }
            });

            var getDate = function(e) {
                var emPxFactor = $element[0].offsetWidth / $scope.task.width;
                var xInEm = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x / emPxFactor;
                return $scope.task.row.gantt.getDateByPosition(xInEm);
            };

            var getMode = function (e) {
                var x = mouseOffset.getOffset(e).x;
                var distance = 5;

                if (x > $element[0].offsetWidth - distance) {
                    return "E";
                } else if (x < distance) {
                    return "W";
                } else {
                    return "";
                }
            };

            var getCursor = function(mode) {
                switch(mode) {
                    case "E": return 'e-resize';
                    case "W": return 'w-resize';
                }
            };

            var enableResizeMode = function (mode) {
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });
            };

            var disableResizeMode = function () {
                if (taskHasBeenResized === true) {
                    $scope.onTaskResized();
                    taskHasBeenResized = false;
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