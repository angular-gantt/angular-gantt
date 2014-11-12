# Sortable

Sort rows by drag & drop on rows label.

## Dependency

[angular-native-dragdrop](https://github.com/ganarajpr/angular-dragdrop) >= 1.0.7

## Usage

    angular.module('myApp', ['gantt', 'gantt.sortable']);

<!-- -->

    <gantt>
      <gantt-sortable enabled="..."></gantt-sortable>
    </gantt>

## Attributes

- #### enabled

    Enable sort of rows.
  
    default: `true`
  
  Attributes can be defined for a specific `Row` object using an object property named `sortable`.

      {
        ...
        // Inside Row object
        'sortable': {
          'enabled': <Boolean>
        }
      }
