(function(){
    'use strict';
    angular.module('gantt.selector', ['gantt']).directive('ganttTaskSelector', ['$rootScope', '$document','$compile', function($rootScope, $document, $compile) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '='
                // Add other option attributes for this plugin
            },
            link: function(scope, element, attrs, ganttCtrl) {
                scope.selectedTasks = [];
                scope.transitSelectedTasks = [];
                var api = ganttCtrl.gantt.api;
                scope.newMoveStarted = false;
                scope.isMouseDown = false;


                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                scope.$watch ('options.enable', function(newValue, oldValue) {
                  if (newValue !== oldValue) {
                    scope.enabled = newValue;
                }
            })

                scope.api = api;

                var getTasks = function (){
                    return scope.selectedTasks;
                }

                api.registerMethod('selector', 'getTasks', getTasks, scope);

                api.directives.on.new(scope, function(directiveName, currentScope, element) {
                 if (directiveName === 'ganttBody') {
                     var elementScope = currentScope.$new();
                     elementScope.pluginScope = scope;

                     var ifElement = $document[0].createElement('div');

                     angular.element(ifElement).attr('data-ng-if', 'enabled && isMouseDown');
                     angular.element(ifElement).addClass('selector-line');
                     var compiled = $compile(ifElement)(scope);
                     element.append(compiled);

                     var x1 = 0, y1 = 0, x2 = 0, y2 = 0;

                     function reCalc() {
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
                    }


                    element.bind('mousedown', function(event) {
                        if (scope.enabled){
                         elementScope.pluginScope.newMoveStarted = true;
                         elementScope.pluginScope.isMouseDown = true;
                         var parentRect = this.getBoundingClientRect();
                         var childRect = event.target.getBoundingClientRect();
                         x1 = childRect.left - parentRect.left + event.offsetX;
                         y1 = childRect.top - parentRect.top + event.offsetY;
                         elementScope.pluginScope.dateLine = scope.api.core.getDateByPosition(x1);
                         element.bind('touchmove mousemove', mouseMoveEventHandler);
                     }
                 });

                    element.bind('mouseup', function(event) {
                     if (scope.enabled){
                        element.unbind('touchmove mousemove', mouseMoveEventHandler);
                        elementScope.pluginScope.isMouseDown = false;
                        var date = scope.api.core.getDateByPosition(event.clientX);
                        elementScope.$apply();
                    }
                });

                    var mouseMoveEventHandler = function(event) {
                        if (elementScope.pluginScope.newMoveStarted && elementScope.pluginScope.selectedTasks.length > 0){
                            elementScope.pluginScope.newMoveStarted = false;
                            elementScope.pluginScope.selectedTasks = [];
                        }
                        y2 = event.target.getBoundingClientRect().top - this.getBoundingClientRect().top + event.offsetY;

                        reCalc();                 
                    };



                }

                if (directiveName === 'ganttRow') {
                    var elementScope = currentScope.$new();
                    elementScope.pluginScope = scope;

                    element.bind('mousemove', function(event) {
                        if (elementScope.pluginScope.isMouseDown){
                            var currentRowTasks = elementScope.row.visibleTasks;
                            for (var i = 0; i < currentRowTasks.length; i++) {
                                if (elementScope.pluginScope.dateLine.isAfter(currentRowTasks[i].model.from) && elementScope.pluginScope.selectedTasks.indexOf(currentRowTasks[i]) < 0){
                                    elementScope.pluginScope.selectedTasks.push(currentRowTasks[i]);
                                }
                            };
                            elementScope.$apply();
                            console.log(elementScope.pluginScope.selectedTasks.length);
                        }                    
                    });


              //       element.bind('mouseleave', function(event) {
              //           if (elementScope.pluginScope.isMouseDown){
              //               var currentRowTasks = elementScope.row.visibleTasks;

              //               if (event.offsetY < 5){
              //                  for (var i = 0; i < currentRowTasks.length; i++) {
              //                   var index = elementScope.pluginScope.selectedTasks.indexOf(currentRowTasks[i]);
              //                   if (elementScope.pluginScope.dateLine.isAfter(currentRowTasks[i].model.from) && index > -1){
              //                     elementScope.pluginScope.selectedTasks.splice(index, 1);
              //                 }
              //             };
              //         }

              //         elementScope.$apply();
              //         console.log(elementScope.pluginScope.selectedTasks.length);
              //     }                    
              // });
}

if (directiveName === 'ganttTask') {


    var elementScope = currentScope.$new();
    elementScope.pluginScope = scope;

    element.bind('click', function (event){
     if (scope.enabled){
        var index = elementScope.pluginScope.selectedTasks.indexOf(currentScope.task);

        if (index == -1){
            elementScope.pluginScope.selectedTasks.push(currentScope.task);
        } else {
            elementScope.pluginScope.selectedTasks.splice(index, 1);
        }
    }
})

                 // var blabla = function (orderId) {
                 //    if ($rootScope.state == TaskPickModes.NORMAL_STATE){
                 //        return orderId != null ? $rootScope.selectedOrderId == orderId : false;
                 //    } else {
                 //        return selectTaskDomainService.isTaskInCollection(orderId);
                 //    }



             }
         });

}
};
}]);
}());