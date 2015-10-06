# Movable

Move and resize tasks.

## Usage

    angular.module('myApp', ['gantt', 'gantt.movable']);

<!-- -->

    <div gantt>
        <gantt-movable enabled="true"
                       allow-moving="true" 
                       allow-resizing="true"
                       allow-row-switching="true">
        </gantt-movable>
    </div>


## Attributes

- ### enabled

    Enable moving and resizing of tasks. Can also be a function (`fn(event, Task)`). Such a 
    function can be used to only activate the moving when a certain mouse button is pressed, 
    or the task is in a certain condition.
    
    default: `true`

- ### allow-moving

    Tasks can be moved inside a row.
    
    default: `true`

- ### allow-resizing

    Tasks can be resized.
    
    default: `true`

- ### allow-row-switching

    Tasks can be moved to a different row.
    
    default: `true`

Attributes can be defined for a specific `Row` or `Task` object using an object property named `movable`

    {
      ...
      // Inside Row or Task object
      // Full options object
      'movable': {
        'enabled': <Boolean>,
        'allowMoving': <Boolean>,
        'allowResizing': <Boolean>,
        'allowRowSwitching': <Boolean>
      }
      
      // Or shortcut for enabled property
      'movable': <Boolean>
    }

## API

### Events
  
- **api.tasks.on.moveBegin(task)**, **api.tasks.on.move(task, fromRow)**, **api.tasks.on.moveEnd(task)**

    A task is starting to move, moving or has stopped moving.

- **api.tasks.on.resizeBegin(task)**, **api.tasks.on.resize(task)**, **api.tasks.on.resizeEnd(task)**

    A task is starting to resize, resizing or has stopped resizing.
