# Tree

Display a tree hierarchy of labels on the side.

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

Take care to define a non-recursive hierarchy model.

## Attributes

- #### enabled

    Enable display of labels tree.

    default: `true`

- #### header

    Column header for the labels.

    default: `Name`

## API

### Methods
    
- **api.tree.refresh()**

    Refresh hierarchy of rows based on model.
