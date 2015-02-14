(function(){
    'use strict';

    angular.module('gantt').factory('GanttHierarchy', [function() {
        var Hierarchy = function () {
            var self = this;

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

                    nameToParent[childRow.model.name] = row;
                    idToParent[childRow.model.id] = row;
                }
            };

            this.refresh = function(rows) {
                nameToRow = {};
                idToRow = {};

                nameToChildren = {};
                idToChildren = {};

                nameToParent = {};
                idToParent = {};

                angular.forEach(rows, function(row) {
                    nameToRow[row.model.name] = row;
                    idToRow[row.model.id] = row;
                });

                angular.forEach(rows, function(row) {
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

                var rootRows = [];
                angular.forEach(rows, function(row) {
                    if (self.parent(row) === undefined) {
                        rootRows.push(row);
                    }
                });

                return rootRows;
            };

            this.children = function(row) {
                var children = idToChildren[row.model.id];
                return children;
            };

            this.descendants = function(row) {
                var descendants = [];

                var children = self.children(row);
                descendants.push.apply(descendants, children);
                if (children !== undefined) {
                    angular.forEach(children, function(child) {
                        var childDescendants = self.descendants(child);
                        descendants.push.apply(descendants, childDescendants);
                    });
                }

                return descendants;
            };

            this.parent = function(row) {
                var parent = idToParent[row.model.id];
                return parent;
            };

            this.ancestors = function(row) {
                var ancestors = [];

                var parent = self.parent(row);
                while (parent !== undefined) {
                    ancestors.push(parent);
                    parent = self.parent(parent);
                }

                return ancestors;
            };
        };

        return Hierarchy;
    }]);
}());
