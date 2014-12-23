# Labels

This plugin is **deprecated**, please use [Table](table.md) instead

Display labels on the side.

## Usage

    angular.module('myApp', ['gantt', 'gantt.labels']);

<!-- -->

    <div gantt>
      <gantt-labels enabled="..." header="...">
      </gantt-labels>
    </div>

## Attributes

- #### enabled

    Enable display of labels.

    default: `true`

- #### header

    Column header for the labels.

    default: `Name`

## API

### Methods

- **api.labels.fitSideWidth()**

    Adjusts the side section to the width of the biggest label.
