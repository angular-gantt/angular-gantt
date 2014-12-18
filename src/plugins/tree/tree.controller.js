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

