(function(){
    'use strict';
    angular.module('gantt.selector', ['gantt']).directive('ganttTaskSelector', ['$rootScope', '$document','$compile', function($rootScope, $document, $compile) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '='
            },
            link: function(scope, element, attrs, ganttCtrl) {
                scope.selectedTasks = [];
                scope.transitSelectedTasks = [];
                var api = ganttCtrl.gantt.api;
                scope.newMoveStarted = false;
                scope.isMouseDown = false;

                var x1 = 0, y1 = 0, y2 = 0;

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                scope.$watch ('options.enable', function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    scope.enabled = newValue;
                }
            });

                scope.api = api;

                var getTasks = function (){
                    return scope.selectedTasks;
                };

                api.registerMethod('selector', 'getTasks', getTasks, scope);

                api.directives.on.new(scope, function(directiveName, currentScope, element) {
                 if (directiveName === 'ganttBody') {
                     var bodyScope = currentScope.$new();
                     bodyScope.pluginScope = scope;

                     var ifElement = $document[0].createElement('div');

                     angular.element(ifElement).attr('data-ng-if', 'enabled && isMouseDown');
                     angular.element(ifElement).addClass('selector-line');
                     var compiled = $compile(ifElement)(scope);
                     element.append(compiled);



                     var reCalc = function () {
                      var lineDiv = element[0].querySelector('.selector-line');

                      if (lineDiv){
                        var y3 = Math.min(y1,y2);
                        var y4 = Math.max(y1,y2);

                        lineDiv.style.left = x1 + 'px';
                        lineDiv.style.top = y3 + 'px';
                        lineDiv.style.width = 2 + 'px';
                        lineDiv.style.backgroundColor = 'yellow';
                        lineDiv.style.height = y4 - y3 + 'px';
                        lineDiv.style.position = 'absolute';
                    }
                };


                element.bind('mousedown', function(event) {
                    if (scope.enabled){
                     bodyScope.pluginScope.newMoveStarted = true;
                     bodyScope.pluginScope.isMouseDown = true;
                     var parentRect = this.getBoundingClientRect();
                     var childRect = event.target.getBoundingClientRect();
                     x1 = childRect.left - parentRect.left + event.offsetX;
                     y1 = childRect.top - parentRect.top + event.offsetY;
                     bodyScope.pluginScope.dateLine = scope.api.core.getDateByPosition(x1);
                     element.bind('touchmove mousemove', mouseMoveEventHandler);
                 }
             });

                element.bind('mouseup', function() {
                 if (scope.enabled){
                    element.unbind('touchmove mousemove', mouseMoveEventHandler);
                    bodyScope.pluginScope.newMoveStarted = false;
                    bodyScope.pluginScope.isMouseDown = false;
                    bodyScope.$apply();
                }
            });

                var mouseMoveEventHandler = function(event) {
                    
                    y2 = event.target.getBoundingClientRect().top - this.getBoundingClientRect().top + event.offsetY;

                    reCalc();                 
                };



            }

            if (directiveName === 'ganttRow') {
                var rowScope = currentScope.$new();
                rowScope.pluginScope = scope;

                element.bind('mousemove', function() {
                    if (rowScope.pluginScope.newMoveStarted && rowScope.pluginScope.isMouseDown){
                        rowScope.pluginScope.newMoveStarted = false;
                        rowScope.pluginScope.selectedTasks = [];
                        var parentRect = this.getBoundingClientRect();
                        var childRect = event.target.getBoundingClientRect();
                        var x1 = childRect.left - parentRect.left + event.offsetX;
                        var customDateLine = scope.api.core.getDateByPosition(x1);

                        var currentRowTasks = rowScope.row.visibleTasks;
                        for (var i = 0; i < currentRowTasks.length; i++) {
                            if (customDateLine.isAfter(currentRowTasks[i].model.from) && rowScope.pluginScope.selectedTasks.indexOf(currentRowTasks[i]) < 0){
                                rowScope.pluginScope.selectedTasks.push(currentRowTasks[i]);
                            }
                        }
                        rowScope.$apply();  
                    }     
                });

element.bind('mouseenter', function() {
    if (rowScope.pluginScope.isMouseDown){
        var currentRowTasks = rowScope.row.visibleTasks;
        for (var i = 0; i < currentRowTasks.length; i++) {
            if (rowScope.pluginScope.dateLine.isAfter(currentRowTasks[i].model.from) && rowScope.pluginScope.selectedTasks.indexOf(currentRowTasks[i]) < 0){
                rowScope.pluginScope.selectedTasks.push(currentRowTasks[i]);
            }
        }
        rowScope.$apply();
    }                    
});


element.bind('mouseleave', function(event) {
    if (rowScope.pluginScope.isMouseDown){
        var currentRowTasks = rowScope.row.visibleTasks;

        if ((event.offsetY < 2 && y1 < y2) || (event.offsetY === event.currentTarget.scrollHeight && y1 > y2)){
         for (var i = 0; i < currentRowTasks.length; i++) {
            var index = rowScope.pluginScope.selectedTasks.indexOf(currentRowTasks[i]);
            if (rowScope.pluginScope.dateLine.isAfter(currentRowTasks[i].model.from) && index > -1){
              rowScope.pluginScope.selectedTasks.splice(index, 1);
          }
      }
  }

  rowScope.$apply();
}                    
});
}

if (directiveName === 'ganttTask') {


    var taskScope = currentScope.$new();
    taskScope.pluginScope = scope;

    element.bind('click', function (){
     if (scope.enabled){
        var index = taskScope.pluginScope.selectedTasks.indexOf(currentScope.task);

        if (index === -1){
            taskScope.pluginScope.selectedTasks.push(currentScope.task);
        } else {
            taskScope.pluginScope.selectedTasks.splice(index, 1);
        }
    }
});
}
});

}
};
}]);
}());