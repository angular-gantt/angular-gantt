# Tree

Display a tree hierarchy of labels on the side.

## Usage

    angular.module('myApp', ['gantt', 'gantt.tree']);

<!-- -->

    <div gantt>
      <gantt-tree enabled="..." header="...">
      </gantt-tree>
    </div>

## Attributes

- #### enabled

    Enable display of labels tree.

    default: `true`

- #### header

    Column header for the labels.

    default: `Name`

## API

### Methods

- **api.tree.fitSideWidth()**

    Adjusts the side section to the width of the biggest label.
