(function(){
	'use strict';
	angular.module('gantt.associator', ['gantt']).directive('associator', ['$compile', '$document', function($compile, $document) {
		return {
			restrict: 'E',
			require: '^gantt',
			scope: {
				enabled: '=?',
				tasks: '=?'
			},
			link: function(scope, element, attrs, ganttCtrl) {
				var api = ganttCtrl.gantt.api;

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
                	if (directiveName === 'gantBody') {
                		var boundsScope = bodyScope.$new();
                		boundsScope.pluginScope = scope;   

                		var ifElement = $document[0].createElement('div');
                		var compiled = $compile(ifElement)(scope);
                		bodyElement.append(compiled);                   
                	}
                });
            }
        };
    }]);
}());

