(function(){
    'use strict';

    var moduleName = 'gantt.drop';
    var directiveName = 'ganttDrop';
    var pluginDependencies = [
        'gantt',
        {module:'ngDragDrop', url:'https://github.com/codef0rmer/angular-dragdrop.git#master'}
    ];

    var failedDependencies = [];
    var loadedDependencies = [];
    var failedDependency;

    for (var i = 0, l = pluginDependencies.length; i < l; i++) {
        var currentDependency = pluginDependencies[i];
        try {
            if (angular.isString(currentDependency)) {
                currentDependency = {module: currentDependency};
                pluginDependencies[i] = currentDependency;
            }
            angular.module(currentDependency.module);
            loadedDependencies.push(currentDependency.module);
        } catch (e) {
            currentDependency.exception = e;
            failedDependencies.push(currentDependency);
        }
    }

    if (failedDependencies.length > 0) {
        angular.module(moduleName, []).directive(directiveName, ['$log', function($log) {
            return {
                restrict: 'E',
                require: '^gantt',
                scope: {
                    enabled: '=?'
                },
                link: function() {
                    $log.warn(moduleName + ' module can\'t require some dependencies:');
                    for (var i= 0,l =failedDependencies.length; i<l; i++) {
                        failedDependency = failedDependencies[i];

                        var errorMessage = failedDependency.module;
                        if (failedDependency.url) {
                            errorMessage += ' (' + failedDependency.url + ')';
                        }
                        if (failedDependency.exception && failedDependency.exception.message) {
                            errorMessage += ': ' + failedDependency.exception.message;
                        }

                        $log.warn(errorMessage);
                    }
                    $log.warn(directiveName + ' plugin directive won\'t be available');
                }
            };
        }]);
    } else {
        angular.module(moduleName, loadedDependencies).directive(directiveName, ['$compile', '$log',
            'ganttMouseOffset', 'moment', function($compile, $log, mouseOffset, moment) {
            // Provides the row sort functionality to any Gantt row
            // Uses the sortableState to share the current row

            return {
                restrict: 'E',
                require: '^gantt',
                scope: {
                    dropEnabled: '=?'
                },
                link: function(scope, element, attrs, ganttCtrl) {
                    var api = ganttCtrl.gantt.api;

                    api.registerEvent('tasks', 'drop');

                    // Load options from global options attribute.
                    if (scope.options && typeof(scope.options.sortable) === 'object') {
                        for (var option in scope.options.sortable) {
                            scope[option] = scope.options[option];
                        }
                    }

                    if (scope.dropEnabled === undefined) {
                        scope.dropEnabled = true;
                    }
                    api.directives.on.controller(scope, function(directiveName, directiveScope) {
                        if (directiveName === 'ganttRow') {
                            directiveScope.dropEnabled = scope.dropEnabled;
                            directiveScope.dropHover = false;
                            directiveScope.onOver = function(/*event,ui*/){
                                directiveScope.dropHover = true;
                                directiveScope.$digest();
                            };
                            directiveScope.onOut = function(){
                                directiveScope.dropHover = false;
                                directiveScope.$digest();
                            };
                            directiveScope.jqyouiOptions = {
                                tolerance: 'pointer',
                                /*activate: function(event, ui){},
                                create: function(event, ui){},
                                deactivate: function(event, ui){}*/
                            };
                            directiveScope.droppedTask = undefined;
                            directiveScope.onDrop = function(event/*, ui*/){
                                directiveScope.dropHover = false;
                                var x = mouseOffset.getOffset(event).x;
                                var startDate = api.core.getDateByPosition(x, true);
                                var endDate = moment(startDate).add(directiveScope.droppedTask.data.duration, 'minutes');
                                directiveScope.droppedTask.from = startDate;
                                directiveScope.droppedTask.to = endDate;

                                var task = directiveScope.row.addTask(directiveScope.droppedTask);
                                api.tasks.raise.drop(task);
                                directiveScope.row.updateVisibleTasks();
                                directiveScope.row.$scope.$digest();
                            };
                        }
                    });

                }
            };
        }]);
    }

}());

