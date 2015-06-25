// (function(){
//     'use strict';
//     angular.module('gantt.selector').directive('ganttTaskSelector', [function() {
//         return {
//             restrict: 'E',
//             require: '^gantt',
//             scope: {
//                 enabled: '=?'
//                 // Add other option attributes for this plugin
//             },
//             link: function(scope, element, attrs, ganttCtrl) {
//                 var api = ganttCtrl.gantt.api;

               
//                 if (scope.enabled === undefined) {
//                     scope.enabled = true;
//                 }

//                 api.directives.on.new(scope, function(dName, dScope, dElement, dAttrs, dController) {
//                     // Write Template Hooks here...
//                 });
//             }
//         };
//     }]);
// }());

