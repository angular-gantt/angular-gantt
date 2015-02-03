(function(){
	'use strict';
    angular.module('gantt.row.limit', ['gantt']).directive('ganttRowLimit', ['$timeout', 'GanttRow',function($timeout, GanttRow) {
        return {
            restrict: 'E',
            require: ['^gantt', '^ganttScrollManager'],
            scope: {
                enabled: '=?'
            },
            link:function(scope, element, attrs, controllers) {
                var api = controllers[0].gantt.api;
                var ready = false;
                var premise, ganttScrollable, previousScrollStart, previousScrollStop;
                var backUpVisibleRow = [];
                
                var visibleRow = [];
                var beforeRow1Model = {id : '____gantt_before_row01', task:[],
                		height:0};
                var beforeRow2Model = {id : '____gantt_before_row02',
                		task:[],
                		height:0};
                var afterRowModel = {id : '____gantt_after_row',
                		task:[],
                		height:0};
                
                var beforeRow1 = new GanttRow(api.gantt.rowsManager, beforeRow1Model);
                var beforeRow2 = new GanttRow(api.gantt.rowsManager, beforeRow2Model);
                var afterRow = new GanttRow(api.gantt.rowsManager, afterRowModel);
                
                beforeRow1.isSystem = true;
                beforeRow2.isSystem = true;
                afterRow.isSystem = true;
                
                var copyVisibleRow = function(){
                	if(!angular.equals(backUpVisibleRow, api.gantt.rowsManager.visibleRows)){	
                	   	previousScrollStart = undefined;
	                    previousScrollStop = undefined;
	                	backUpVisibleRow = [];
	                	for(var i = 0; i < api.gantt.rowsManager.visibleRows.length; i++ ){
	                		backUpVisibleRow.push(api.gantt.rowsManager.visibleRows[i]);
	                	}
	                	
	                	return true;
                	}
                	return false;
                };
                
                var limitRow = function(usePremise, recalculate){
					if(scope.enabled){
						if(usePremise !== false){
							usePremise = true;
						}
						if(recalculate !== false){
							recalculate = true;
						}
						if(!ready){
							return;
						}
						if(premise !== undefined){
							$timeout.cancel(premise);
						}
						if(usePremise){
							premise = $timeout(function(){
								premise = undefined;
								execuxteLimitRow(true);
							}, 100);
						}
						else{
							execuxteLimitRow(recalculate);
						}
					}
                };
                
                var execuxteLimitRow = function(recalculate){
                	var scrollStart = ganttScrollable[0].scrollTop;
                	var scrollStop = ganttScrollable[0].getBoundingClientRect().height + scrollStart;
	                if(recalculate || previousScrollStart !== scrollStart || previousScrollStop !== scrollStop){
	                	previousScrollStart = scrollStart;
	                	previousScrollStop = scrollStop;
	        			api.gantt.rowsManager.visibleRows = [];
	        			var totalHeight = 0;
	        			var beforeHeight = 0;
	        			var visibleHeight = 0;
	        			var lastInvisibleIndex = -1;

	        			if(lastInvisibleIndex !== -1){
	        				api.gantt.rowsManager.visibleRows.unshift(beforeRow1);
	        				if(lastInvisibleIndex % 2 !== 0){
	        					api.gantt.rowsManager.visibleRows.unshift(beforeRow2);
	        					beforeRow1Model.height = beforeHeight / 2;
	        					beforeRow2Model.height = beforeHeight / 2;
	        				}
	        				else{
	        					beforeRow1Model.height = beforeHeight;
	        				}
	        			}
	        			
	        			var afterHeight = totalHeight - beforeHeight - visibleHeight;
	        			
	        			if(afterHeight !== 0){
	        				afterRowModel.height = afterHeight;
	        				api.gantt.rowsManager.visibleRows.push(afterRow);
	        			}
	        			
	        			visibleRow = api.gantt.rowsManager.visibleRows;
	        		}
	                else{
	                	api.gantt.rowsManager.visibleRows = visibleRow;
	                }
	                var vertical = controllers[1].getVerticalRecievers();
                    for (var i = 0, l = vertical.length; i < l; i++) {
                        var vElement = vertical[i];
                        if (vElement.parentNode.scrollTop !== scrollStart) {
                            vElement.parentNode.scrollTop = scrollStart;
                        }
                    }
                };
                
                api.directives.on.new(scope, function(directiveName, directiveScope, directiveElement){
	                if(directiveName === 'ganttScrollable'){
	        			ganttScrollable = directiveElement;
	        			directiveElement.bind('resize', function(){
	        				limitRow(false);
	        			});
	        			ready = true;
	        		}
                });
                
                api.rows.on.viewUpdate(scope, function(){
                	limitRow(false, copyVisibleRow());
                });
                
                api.scroll.on.scroll(scope, limitRow);
            }
        };
    }]);
}());

