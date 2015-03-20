# Sortable

Sort rows by drag & drop on rows label.

## Dependency

[angular-native-dragdrop](https://github.com/ganarajpr/angular-dragdrop) >= 1.1.0

## Usage

    angular.module('myApp', ['gantt', 'gantt.labels', 'gantt.sortable']);

<!-- -->

    <div gantt>
      <gantt-labels></gantt-labels>
      <gantt-sortable enabled="..."></gantt-sortable>
    </div>

## Attributes

- #### enabled

    Enable sort of rows.
  
    default: `true`
  
  Attributes can be defined for a specific `Row` object using an object property named `sortable`.

      {
        ...
        // Inside Row object
        // Full options object
        'sortable': {
          'enabled': <Boolean>
        }

        // Or shortcut for enabled property
        'movable': <Boolean>
      }
