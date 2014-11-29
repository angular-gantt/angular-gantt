# Labels

Display labels on the side.

## Usage

    angular.module('myApp', ['gantt', 'gantt.labels']);

<!-- -->

    <div gantt>
      <gantt-labels enabled="..."></gantt-labels>
    </div>

## Attributes

- #### enabled

    Enable display of labels.

    default: `true`

## API

### Methods

- **api.labels.fitSideWidth()**

    Adjusts the side section to the width of the biggest label.
