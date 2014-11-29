# Labels

Display labels on the side.

## Usage

    angular.module('myApp', ['gantt', 'gantt.labels']);

<!-- -->

    <div gantt>
      <gantt-labels enabled="true"
                    header="'Events'">
      </gantt-labels>
    </div>

## Attributes

- #### enabled

    Enable display of labels.

    default: `true`

- #### header

    Column header for the side labels. This will not change once defined.

    default: `Name`

## API

### Methods

- **api.labels.fitSideWidth()**

    Adjusts the side section to the width of the biggest label.
