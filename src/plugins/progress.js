'use strict';
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
