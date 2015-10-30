(function(){
    'use strict';

    var moduleName = 'gantt.dragtask';
    var directiveName = 'ganttDragTask';
    var pluginDependencies = [
        'gantt',
        {module:'ngDragDrop', url:'https://github.com/codef0rmer/angular-dragdrop.git#master'}
    ];

    var failedDependencies = [];
    var loadedDependencies = ['gantt.dragtask.templates'];
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
        angular.module(moduleName, loadedDependencies).directive(directiveName, ['$log','$templateCache', function($log,$templateCache) {
            // Provides the row sort functionality to any Gantt row
            // Uses the sortableState to share the current row

            return {
                restrict: 'E',
                require: '^?gantt',
                templateUrl: function(tElement, tAttrs) {
                    var templateUrl;
                    if (tAttrs.templateUrl === undefined) {
                        templateUrl = 'plugins/dragtask/dragTask.tmpl.html';
                    } else {
                        templateUrl = tAttrs.templateUrl;
                    }
                    if (tAttrs.template) {
                        $templateCache.put(templateUrl, tAttrs.template);
                    }
                    return templateUrl;
                },
                replace:true,
                scope: {
                    task: '=',
                    enabled: '=?'
                },
                link: function(scope/*, element, attrs, ganttCtrl*/) {
                    var api;
                    var ganttScope = angular.element('div[gantt]').isolateScope();
                    if(angular.isDefined(scope.task) && angular.isDefined(ganttScope) && ganttScope !== null && angular.isDefined(ganttScope.gantt)){
                        api = ganttScope.gantt.api;
                    }
                    else{
                        $log.warn('ganttCtrl is null or undefined');
                    }
                    scope.jqyouiOptions = {
                        revert: 'invalid',
                        cursorAt:{left:0, top:0},
                        scroll: true
                    };

                    // Load options from global options attribute.
                    if (scope.enabled === undefined) {
                        scope.enabled = true;
                    }
                    scope.dragActive = false;
                    scope.onStart = function(){
                        scope.dragActive = true;
                        var aColumn = api.gantt.columnsManager.getFirstColumn();
                        if(angular.isDefined(aColumn)) {
                            scope.task.width =  Math.round(aColumn.width * ((scope.task.data.duration * 60 * 1000) / aColumn.duration));
                        }
                    };
                    scope.onStop = function(/*event, ui*/){
                        scope.dragActive = false;
                    };

                }
            };
        }]);
    }

}());

