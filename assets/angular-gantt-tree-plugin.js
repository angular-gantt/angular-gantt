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

                function fitSideWidthToLabels() {
                    var labels = ganttCtrl.gantt.side.$element[0].getElementsByClassName('gantt-row-label');
                    var newSideWidth = 0;

                    angular.forEach(labels, function (label) {
                        var width = label.children[0].offsetWidth;
                        newSideWidth = Math.max(newSideWidth, width);
                    });

                    if (newSideWidth >= 0) {
                        api.side.setWidth(newSideWidth);
                    }
                }

                api.registerMethod('tree', 'fitSideWidth', fitSideWidthToLabels, this);
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

        var isVisible = function(row) {
            var parentRow = $scope.parent(row);
            while (parentRow !== undefined) {
                if (parentRow !== undefined && parentRow._collapsed) {
                    return false;
                }
                parentRow = $scope.parent(parentRow);
            }
            return true;
        };

        var filterRowsFunction = function(rows) {
            return rows.filter(function(row) {
                return isVisible(row);
            });
        };

        var sortRowsFunction = function(rows) {
            var sortedRows = [];
            var rootRows = [];

            var hasParent = false;

            angular.forEach(rows, function(row) {
                var rowParent = $scope.parent(row);
                if (rowParent === undefined) {
                    rootRows.push(row);
                } else {
                    hasParent = true;
                }
            });

            var handleChildren = function(row) {
                sortedRows.push(row);
                var children = $scope.children(row);



                if (children !== undefined && children.length > 0) {
                    var sortedChildren = children.sort(function(a, b) {
                        return rows.indexOf(a) - rows.indexOf(b);
                    });

                    angular.forEach(sortedChildren, function(child) {
                        handleChildren(child);
                    });
                }
            };

            angular.forEach(rootRows, function(row) {
                handleChildren(row);
            });

            return sortedRows;
        };

        $scope.gantt.api.rows.addRowSorter(sortRowsFunction);
        $scope.gantt.api.rows.addRowFilter(filterRowsFunction);

        $scope.$on('$destroy', function() {
            $scope.gantt.api.rows.removeRowSorter(sortRowsFunction);
            $scope.gantt.api.rows.removeRowFilter(filterRowsFunction);
        });

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

                nameToParent[childRow.model.name] = row;
                idToParent[childRow.model.id] = row;
            }
        };

        var refresh = function() {
            nameToRow = {};
            idToRow = {};

            nameToChildren = {};
            idToChildren = {};

            nameToParent = {};
            idToParent = {};

            angular.forEach($scope.gantt.rowsManager.filteredRows, function(row) {
                nameToRow[row.model.name] = row;
                idToRow[row.model.id] = row;
            });

            angular.forEach($scope.gantt.rowsManager.filteredRows, function(row) {
                if (row.model.parent !== undefined) {
                    var parentRow = nameToRow[row.model.parent];
                    if (parentRow === undefined) {
                        parentRow = idToRow[row.model.parent];
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
            angular.forEach($scope.gantt.rowsManager.filteredRows, function(row) {
                if ($scope.parent(row) === undefined) {
                    $scope.rootRows.push(row);
                }
            });

            if ($scope.gantt.rowsManager.filteredRows.length > 0) {
                $scope.gantt.api.rows.sort();
                $scope.gantt.api.rows.refresh();
            }
        };

        $scope.gantt.api.registerMethod('tree', 'refresh', refresh, this);

        $scope.$watchCollection('gantt.rowsManager.filteredRows', function() {
            refresh();
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
    }]).controller('GanttTreeChildrenController', ['$scope', function($scope) {
        $scope.$watch('children(row)', function(newValue) {
            $scope.$parent.childrenRows = newValue;
        });

        $scope.$watch('collapsed', function(newValue) {
            $scope.row._collapsed = newValue;
            $scope.gantt.api.rows.refresh();
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