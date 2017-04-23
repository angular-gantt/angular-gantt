export class GanttHierarchy {
  private nameToRow = {};

  private idToRow = {};

  private nameToChildren = {};
  private idToChildren = {};

  private nameToParent = {};
  private idToParent = {};

  private registerChildRow (row, childRow) {
    if (childRow !== undefined) {
      let nameChildren = this.nameToChildren[row.model.name];
      if (nameChildren === undefined) {
        nameChildren = [];
        this.nameToChildren[row.model.name] = nameChildren;
      }
      nameChildren.push(childRow);

      let idChildren = this.idToChildren[row.model.id];
      if (idChildren === undefined) {
        idChildren = [];
        this.idToChildren[row.model.id] = idChildren;
      }
      idChildren.push(childRow);

      this.nameToParent[childRow.model.name] = row;
      this.idToParent[childRow.model.id] = row;
    }
  }

  refresh (rows) {
    this.nameToRow = {};
    this.idToRow = {};

    this.nameToChildren = {};
    this.idToChildren = {};

    this.nameToParent = {};
    this.idToParent = {};

    let row;

    for (let i = 0; i < rows.length; i++) {
      row = rows[i];
      this.nameToRow[row.model.name] = row;
      this.idToRow[row.model.id] = row;
    }

    for (let i = 0; i < rows.length; i++) {
      row = rows[i];
      if (row.model.parent !== undefined) {
        let parentRow = this.nameToRow[row.model.parent];
        if (parentRow === undefined) {
          parentRow = this.idToRow[row.model.parent];
        }

        if (parentRow !== undefined) {
          this.registerChildRow(parentRow, row);
        }
      }

      if (row.model.children !== undefined) {
        let children = row.model.children;
        for (let j = 0; j < children.length; j++) {
          let childRowNameOrId = children[j];
          let childRow = this.nameToRow[childRowNameOrId];
          if (childRow === undefined) {
            childRow = this.idToRow[childRowNameOrId];
          }

          if (childRow !== undefined) {
            this.registerChildRow(row, childRow);
          }
        }
      }
    }

    let rootRows = [];
    for (let i = 0; i < rows.length; i++) {
      row = rows[i];
      if (this.parent(row) === undefined) {
        rootRows.push(row);
      }
    }

    return rootRows;
  }

  children (row) {
    let children = this.idToChildren[row.model.id];
    return children;
  }

  descendants (row) {
    let descendants = [];

    let children = this.children(row);
    descendants.push.apply(descendants, children);
    if (children !== undefined) {
      for (let i = 0; i < children.length; i++) {
        let childDescendants = this.descendants(children[i]);
        descendants.push.apply(descendants, childDescendants);
      }
    }

    return descendants;
  };

  parent (row) {
    let parent = this.idToParent[row.model.id];
    return parent;
  };

  ancestors (row) {
    let ancestors = [];

    let parent = this.parent(row);
    while (parent !== undefined) {
      ancestors.push(parent);
      parent = this.parent(parent);
    }

    return ancestors;
  };
}

export default function GanttHierarchyFactory() {
  'ngInject';

  return GanttHierarchy;
}
