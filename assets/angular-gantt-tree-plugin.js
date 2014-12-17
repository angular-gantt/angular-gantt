/*
Project: angular-gantt v1.0.0 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: http://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
(function(){
    'use strict';
    angular.module('gantt.tree', ['gantt', 'gantt.tree.templates', 'ui.tree']).directive('ganttTree', ['ganttUtils', '$compile', '$document', function(utils, $compile, $document) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                header: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.header === undefined) {
                    scope.header = 'Name';
                }

                api.directives.on.new(scope, function(directiveName, sideContentScope, sideContentElement) {
                    if (directiveName === 'ganttSideContent') {
                        var labelsScope = sideContentScope.$new();
                        labelsScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');

                        var labelsElement = $document[0].createElement('gantt-side-content-tree');
                        angular.element(ifElement).append(labelsElement);

                        sideContentElement.append($compile(ifElement)(labelsScope));
                    }
                });


            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttRowTreeLabel', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowTreeLabel');
        builder.restrict = 'A';
        builder.templateUrl = undefined;
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttSideContentTree', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideContentTree', 'plugins/tree/sideContentTree.tmpl.html');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree').controller('GanttTreeController', ['$scope', function($scope) {
        $scope.rootRows = [];

        var nameToRow = {};
        var idToRow = {};

        var nameToChildren = {};
        var idToChildren = {};

        var nameToParent = {};
        var idToParent = {};

        var registerChildRow = function(row, childRow) {
            if (childRow !== undefined) {
                var nameChildren = nameToChildren[row.model.name];
                if (nameChildren === undefined) {
                    nameChildren = [];
                    nameToChildren[row.model.name] = nameChildren;
                }
                nameChildren.push(childRow);


                var idChildren = idToChildren[row.model.id];
                if (idChildren === undefined) {
                    idChildren = [];
                    idToChildren[row.model.id] = idChildren;
                }
                idChildren.push(childRow);

                nameToParent[childRow.model.name] = childRow;
                idToParent[childRow.model.id] = childRow;
            }
        };

        var updateHierarchy = function() {
            nameToRow = {};
            idToRow = {};

            nameToChildren = {};
            idToChildren = {};

            nameToParent = {};
            idToParent = {};

            angular.forEach($scope.gantt.rowsManager.visibleRows, function(row) {
                nameToRow[row.model.name] = row;
                idToRow[row.model.id] = row;
            });

            angular.forEach($scope.gantt.rowsManager.visibleRows, function(row) {
                if (row.model.parent !== undefined) {
                    var parentRow = nameToRow[row.model.parent];
                    if (parentRow === undefined) {
                        parentRow = idToRow[row.model.id];
                    }

                    if (parentRow !== undefined) {
                        registerChildRow(parentRow, row);
                    }
                }

                if (row.model.children !== undefined) {
                    angular.forEach(row.model.children, function(childRowNameOrId) {
                        var childRow = nameToRow[childRowNameOrId];
                        if (childRow === undefined) {
                            childRow = idToRow[childRowNameOrId];
                        }

                        if (childRow !== undefined) {
                            registerChildRow(row, childRow);
                        }
                    });
                }
            });

            $scope.rootRows = [];
            angular.forEach($scope.gantt.rowsManager.visibleRows, function(row) {
                if ($scope.parent(row) === undefined) {
                    $scope.rootRows.push(row);
                }
            });
        };

        $scope.$watchCollection('gantt.rowsManager.visibleRows', function() {
            updateHierarchy();
        });

        $scope.children = function(row) {
            if (row === undefined) {
                return $scope.rootRows;
            }
            var children = idToChildren[row.model.id];
            if (children === undefined) {
                children = nameToChildren[row.model.name];
            }
            return children;
        };

        $scope.parent = function(row) {
            var parent = idToParent[row.model.id];
            if (parent === undefined) {
                parent = nameToParent[row.model.name];
            }
            return parent;
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };
    }]).controller('GanttTreeChildrenController', ['$scope', function($scope) {
        $scope.$watch('children(row)', function(newValue) {
            $scope.$parent.childrenRows = newValue;
        });
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttTreeBody', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttTreeBody', 'plugins/tree/treeBody.tmpl.html');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getLabelsCss = function() {
                var css = {};

                if ($scope.maxHeight) {
                    var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                    css['max-height'] = $scope.maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());



(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttTreeHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTreeHeader', 'plugins/tree/treeHeader.tmpl.html');
        return builder.build();
    }]);
}());


//# sourceMappingURL=angular-gantt-tree-plugin.js.map