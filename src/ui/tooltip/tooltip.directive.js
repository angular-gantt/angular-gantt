gantt.directive('ganttTooltip', ['$timeout', '$document', 'debounce', 'smartEvent', function ($timeout, $document, debounce, smartEvent) {
    // This tooltip displays more information about a task

    return {
        restrict: "E",
		templateUrl: function (tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return "template/gantt.tooltip.tmpl.html";
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        transclude: true,
        scope: { task: "=ngModel" },
        controller: ['$scope', '$element', function ($scope, $element) {
            var bodyElement = angular.element($document[0].body);
            $scope.visible = false;
            $scope.css = {};

            $scope.mouseEnter = function (e) {
                if (!$scope.task.isMoving) {
                    showTooltip(e.clientX);
                }
            };

            $scope.mouseLeave = function (e) {
                if (!$scope.task.isMoving) {
                    hideTooltip();
                }
            };

            var mouseMoveHandler = smartEvent($scope, bodyElement, 'mousemove', debounce(function (e) {
                if ($scope.visible === true) {
                    updateTooltip(e.clientX);
                } else {
                    showTooltip(e.clientX);
                }
            }, 1));

            $scope.$watch("task.isMoving", function(newValue, oldValue) {
                if (newValue === true) {
                    mouseMoveHandler.bind();
                } else if (newValue === false ) {
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
                    var elTip = angular.element($element.children()[0]);

                    updateTooltip(x);

                    $scope.css.top = $element[0].getBoundingClientRect().top + "px";
                    $scope.css.marginTop = -elTip[0].offsetHeight - 8 + "px";
                    $scope.css.opacity = 1;
                }, 1, true);
            };

            var updateTooltip = function(x) {
                var elTip = angular.element($element.children()[0]);

                elTip.removeClass('gantt-task-infoArrow');
                elTip.removeClass('gantt-task-infoArrowR');

                // Check if info is overlapping with view port
                if (x + elTip[0].offsetWidth > getViewPortWidth()) {
                    $scope.css.left = (x + 20 - elTip[0].offsetWidth) + "px";
                    elTip.addClass('gantt-task-infoArrowR'); // Right aligned info
                } else {
                    $scope.css.left = (x - 20) + "px";
                    elTip.addClass('gantt-task-infoArrow');
                }
            };

            var hideTooltip = function() {
                $scope.css.opacity = 0;
                $scope.visible = false;
            };
        }]
    };
}]);