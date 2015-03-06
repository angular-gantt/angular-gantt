# Tree

Display a tree hierarchy of labels on the side.

## Dependency

[angular-ui-tree](https://github.com/angular-ui-tree/angular-ui-tree)

## Usage

    angular.module('myApp', ['gantt', 'gantt.tree']);

<!-- -->

    <div gantt>
      <gantt-tree enabled="..." header="...">
      </gantt-tree>
    </div>
    
## Model

Rows can specify a list of children using `children` property and/or a parent using `parent` property. Name and id
can be used to define the hierarchy.

    var data = [
      {name: 'Parent', children: ['One', 'Two', 'Three']},
      {name: 'One', tasks: [...]},
      {name: 'Two', tasks: [...]},
      {name: 'Three', tasks: [...]},
    ]

<!-- -->

    var data = [
      {name: 'Parent'},
      {name: 'One', parent: 'Parent', tasks: [...]},
      {name: 'Two', parent: 'Parent', tasks: [...]},
      {name: 'Three', parent: 'Parent', tasks: [...]},
    ]

Take care to define a non-recursive hierarchy model, and check that a row is attached to a maximum of one parent.

## Attributes

- #### enabled

    Enable display of labels tree.

    default: `true`

- #### header

    Column header for the labels.

    default: `Name`

- #### content

    Template of the content of each row. It can contain HTML and will be automatically compiled.

    It can be modified for a specific row using [Row model](../configuration/data.md) `content` property.

    default: `{{row.model.name}}`

- #### header-content

    Template of the content of header. It can contain HTML and will be automatically compiled.

    default: `{{getHeader()}}`

## API

### Methods
    
- **api.tree.refresh()**

    Refresh hierarchy of rows based on model.

- **api.tree.isCollapsed(rowId)**

    Check if a row is collapsed.

- **api.tree.collapse(rowId)**

    Collapse a row.

- **api.tree.expand(rowId)**

    Expand a row.
    
- **api.tree.collapseAll()**
    
    Collapse all rows.
    
- **api.tree.expandAll()**
        
    Expand all rows.
    
    
### Events
    
- **api.tree.on.collapsed(row, collapsed)**

    A row has collapsed or expanded
