(function(){
    'use strict';
    angular.module('gantt.associator', ['gantt']).directive('ganttAssociator', ['$compile', '$document', function($compile, $document) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                tasks: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;  
                var x1, y1;
                var pointArray = [];

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.bounds) === 'object') {
                    for (var option in scope.options.bounds) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                api.directives.on.new(scope, function(directiveName, bodyScope, bodyElement) {
                    if (directiveName === 'ganttBody') {
                        var boundsScope = bodyScope.$new();
                        boundsScope.pluginScope = scope;   

                        var comp = $document[0].createElement('canvas');
                        
                        var canvas = $compile(comp)(scope)[0];

                        canvas.style.position = 'absolute';
                        canvas.style.top = '0';
                        canvas.style.zIndex = '100';

                        bodyElement.prepend(canvas);  
                        var ctx = canvas.getContext("2d");
                        scope.$watchCollection('tasks', function(newArray, oldArray) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            
                            if (newArray.length == 1 && newArray[0].orderPosition == 'single'){
                                return;
                            } else if (newArray.length > 0) {
                                canvas.style.width ='100%';
                                canvas.style.height='100%';

                                canvas.width  = canvas.offsetWidth;
                                canvas.height = canvas.offsetHeight;

                                var parentRect = bodyElement[0].getBoundingClientRect();

                                

                                newArray.sort(function (a, b){
                                    if (a.from < b.from){
                                        return -1
                                    } else if (a.from > b.from){
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                });

                                for (var i = 0; i < newArray.length; i++) {

                                    var childRect = newArray[i].view[0].getBoundingClientRect();

                                    
                                    x1 = childRect.left - parentRect.left;
                                    y1 = childRect.top - parentRect.top;

                                    
                                    if (newArray[i].orderPosition == 'start'){
                                        ctx.moveTo(x1, y1);
                                        if (newArray.length == 1){
                                            ctx.lineTo(parentRect.width, y1);
                                        }
                                    } else if (newArray[i].orderPosition == 'end'){
                                        if (newArray.length == 1){
                                            ctx.moveTo(0, y1);
                                        } 
                                        ctx.lineTo(x1, y1);
                                    } else {
                                        if (newArray.length == 1){
                                            ctx.moveTo(0, y1);
                                            ctx.lineTo(x1, y1);
                                            ctx.lineTo(parentRect.width, y1);
                                        } else if (i == 0){
                                            ctx.moveTo(0, y1);
                                            ctx.lineTo(x1, y1);
                                        } else if (i == newArray.length){
                                            ctx.lineTo(x1, y1);
                                            ctx.lineTo(parentRect.width, y1);
                                        } else {
                                            ctx.lineTo(x1, y1);
                                        }
                                    }
                                };

                                ctx.stroke();
                            }
                        }
                        );                 
}


});
}
};
}]);
}());