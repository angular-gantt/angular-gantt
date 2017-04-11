export default function () {
  'ngInject';

  let Hierarchy = function () {
    let self = this;

    let nameToRow = {};

    let idToRow = {};

    let nameToChildren = {};
    let idToChildren = {};

    let nameToParent = {};
    let idToParent = {};

    let registerChildRow = function (row, childRow) {
      if (childRow !== undefined) {
        let nameChildren = nameToChildren[row.model.name];
        if (nameChildren === undefined) {
          nameChildren = [];
          nameToChildren[row.model.name] = nameChildren;
        }
        nameChildren.push(childRow);

        let idChildren = idToChildren[row.model.id];
        if (idChildren === undefined) {
          idChildren = [];
          idToChildren[row.model.id] = idChildren;
        }
        idChildren.push(childRow);

        nameToParent[childRow.model.name] = row;
        idToParent[childRow.model.id] = row;
      }
    };

    this.refresh = function (rows) {
      nameToRow = {};
      idToRow = {};

      nameToChildren = {};
      idToChildren = {};

      nameToParent = {};
      idToParent = {};

      let row;

      for (let i = 0; i < rows.length; i++) {
        row = rows[i];
        nameToRow[row.model.name] = row;
        idToRow[row.model.id] = row;
      }

      for (let i = 0; i < rows.length; i++) {
        row = rows[i];
        if (row.model.parent !== undefined) {
          let parentRow = nameToRow[row.model.parent];
          if (parentRow === undefined) {
            parentRow = idToRow[row.model.parent];
          }

          if (parentRow !== undefined) {
            registerChildRow(parentRow, row);
          }
        }

        if (row.model.children !== undefined) {
          let children = row.model.children;
          for (let j = 0; j < children.length; j++) {
            let childRowNameOrId = children[j];
            let childRow = nameToRow[childRowNameOrId];
            if (childRow === undefined) {
              childRow = idToRow[childRowNameOrId];
            }

            if (childRow !== undefined) {
              registerChildRow(row, childRow);
            }
          }
        }
      }

      let rootRows = [];
      for (let i = 0; i < rows.length; i++) {
        row = rows[i];
        if (self.parent(row) === undefined) {
          rootRows.push(row);
        }
      }

      return rootRows;
    };

    this.children = function (row) {
      let children = idToChildren[row.model.id];
      return children;
    };

    this.descendants = function (row) {
      let descendants = [];

      let children = self.children(row);
      descendants.push.apply(descendants, children);
      if (children !== undefined) {
        for (let i = 0; i < children.length; i++) {
          let childDescendants = self.descendants(children[i]);
          descendants.push.apply(descendants, childDescendants);
        }
      }

      return descendants;
    };

    this.parent = function (row) {
      let parent = idToParent[row.model.id];
      return parent;
    };

    this.ancestors = function (row) {
      let ancestors = [];

      let parent = self.parent(row);
      while (parent !== undefined) {
        ancestors.push(parent);
        parent = self.parent(parent);
      }

      return ancestors;
    };
  };

  return Hierarchy;
}
