import {GanttHierarchy} from '../../core/logic/util/hierarchy.factory';

export default function ($scope, $filter, GanttHierarchy: { new(): GanttHierarchy; }) {
  'ngInject';
  $scope.rootRows = [];

  $scope.getHeader = function () {
    return $scope.pluginScope.header;
  };

  let hierarchy = new GanttHierarchy();

  $scope.pluginScope.$watchGroup(['keepAncestorOnFilterRow', 'enabled'], function (value) {
    let keepAncestor = value[0] && value[1];

    if (keepAncestor) {
      let filterImpl = function (sortedRows, filterRow, filterRowComparator) {
        hierarchy.refresh(sortedRows);

        let leaves = [];
        for (let i = 0; i < sortedRows.length; i++) {
          let children = hierarchy.children(sortedRows[i]);
          if (!children || children.length === 0) {
            leaves.push(sortedRows[i]);
          }
        }

        let filteredLeaves = $filter('filter')(leaves, filterRow, filterRowComparator);

        let filterRowKeepAncestor = function (row) {
          if (filteredLeaves.indexOf(row) > -1) {
            return true;
          }

          let descendants = hierarchy.descendants(row);

          for (let i = 0; i < descendants.length; i++) {
            if (filteredLeaves.indexOf(descendants[i]) > -1) {
              return true;
            }
          }

          return false;
        };

        return $filter('filter')(sortedRows, filterRowKeepAncestor, filterRowComparator);
      };
      $scope.gantt.rowsManager.setFilterImpl(filterImpl);
    } else {
      $scope.gantt.rowsManager.setFilterImpl(false);
    }
  });

  let isVisible = function (row) {
    let parentRow = $scope.parent(row);
    while (parentRow !== undefined) {
      if (parentRow !== undefined && parentRow._collapsed) {
        return false;
      }
      parentRow = $scope.parent(parentRow);
    }
    return true;
  };

  let filterRowsFunction = function (rows) {
    return rows.filter(function (row) {
      return isVisible(row);
    });
  };

  let sortRowsFunction = function (rows) {
    let sortedRows = [];
    let rootRows = [];

    let hasParent = false;

    for (let i = 0; i < rows.length; i++) {
      let rowParent = $scope.parent(rows[i]);
      if (rowParent === undefined) {
        rootRows.push(rows[i]);
      } else {
        hasParent = true;
      }
    }

    let handleChildren = function (row) {
      sortedRows.push(row);
      let children = $scope.children(row);

      if (children !== undefined && children.length > 0) {
        let sortedChildren = children.sort(function (a, b) {
          return rows.indexOf(a) - rows.indexOf(b);
        });

        for (let i = 0; i < sortedChildren.length; i++) {
          handleChildren(sortedChildren[i]);
        }
      }
    };

    for (let i = 0; i < rootRows.length; i++) {
      handleChildren(rootRows[i]);
    }

    return sortedRows;
  };
  $scope.gantt.api.rows.addRowSorter(sortRowsFunction);
  $scope.gantt.api.rows.addRowFilter(filterRowsFunction);

  $scope.$on('$destroy', function () {
    $scope.gantt.api.rows.removeRowSorter(sortRowsFunction);
    $scope.gantt.api.rows.removeRowFilter(filterRowsFunction);
  });

  let refresh = function () {
    $scope.rootRows = hierarchy.refresh($scope.gantt.rowsManager.filteredRows);

    if ($scope.gantt.rowsManager.filteredRows.length > 0) {
      $scope.gantt.api.rows.sort();
      $scope.gantt.api.rows.refresh();
    }
  };

  $scope.gantt.api.rows.on.remove($scope, refresh);
  $scope.gantt.api.rows.on.add($scope, refresh);

  let isRowCollapsed = function (rowId) {
    let row;
    if (typeof rowId === 'string') {
      row = $scope.gantt.rowsManager.rowsMap[rowId];
    } else {
      row = rowId;
    }
    if (row === undefined) {
      return undefined;
    }
    if (row._collapsed === undefined) {
      return false;
    }
    return row._collapsed;
  };

  let expandRow = function (rowId) {
    let row;
    if (typeof rowId === 'string') {
      row = $scope.gantt.rowsManager.rowsMap[rowId];
    } else {
      row = rowId;
    }
    if (row === undefined) {
      return;
    }

    let rowScope = $scope.nodeScopes[row.model.id];
    if (rowScope.collapsed) {
      rowScope.toggle();
    }
  };

  let collapseRow = function (rowId) {
    let row;
    if (typeof rowId === 'string') {
      row = $scope.gantt.rowsManager.rowsMap[rowId];
    } else {
      row = rowId;
    }
    if (row === undefined) {
      return;
    }

    let rowScope = $scope.nodeScopes[row.model.id];
    if (!rowScope.collapsed) {
      rowScope.toggle();
    }
  };

  let getHierarchy = function () {
    return hierarchy;
  };

  $scope.getHeaderContent = function () {
    return $scope.pluginScope.headerContent;
  };

  $scope.gantt.api.registerMethod('tree', 'refresh', refresh, this);
  $scope.gantt.api.registerMethod('tree', 'isCollapsed', isRowCollapsed, this);
  $scope.gantt.api.registerMethod('tree', 'expand', expandRow, this);
  $scope.gantt.api.registerMethod('tree', 'collapse', collapseRow, this);

  $scope.gantt.api.registerEvent('tree', 'collapsed');

  $scope.gantt.api.registerMethod('tree', 'getHierarchy', getHierarchy, this);

  $scope.$watchCollection('gantt.rowsManager.filteredRows', function () {
    refresh();
  });

  $scope.children = function (row) {
    if (row === undefined) {
      return $scope.rootRows;
    }
    return hierarchy.children(row);
  };

  $scope.parent = function (row) {
    return hierarchy.parent(row);
  };

  $scope.nodeScopes = {};
}
