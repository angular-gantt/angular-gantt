# History

Add an history to data changes with undo and redo features.

## Dependency

[ng-lodash](https://github.com/rockabox/ng-lodash)
[angular](https://github.com/angular/angular.js) >= 1.3.3

History plugin use a feature introduced in AngularJS 1.3.3.

## Usage

    angular.module('myApp', ['gantt', 'gantt.history']);

<!-- -->

    <gantt>
      <gantt-history enabled="..."></gantt-history>
    </gantt>

## Attributes

- #### enabled

    Enable history
  
    default: `true`

## API

### Methods
  
- **api.history.undo()**, **api.tasks.redo()**

    Perform undo (or redo).

- **api.history.canUndo()**, **api.tasks.canRedo()**

    Check if undo is possible (or redo).

- **api.history.clear()**

    Clear the history.
