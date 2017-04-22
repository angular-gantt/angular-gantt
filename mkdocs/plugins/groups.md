# Groups

Groups tasks into a single row based on defined hierarchy. See [Tree Plugin](tree.md#model) to define this tree hierarchy.

## Usage

    angular.module('myApp', ['gantt', 'gantt.groups']);

<!-- -->

    <div gantt>
      <gantt-groups enabled="..." display="...">
      </gantt-groups>
    </div>

## Attributes

- #### enabled

    Enable display of groups.

    default: `true`

- #### display

    Display mode of groups.

    - `group`: Display a single object representing the grouped task.
    - `overview`: Display a minimized overview of each grouped task.
    - `promote`: Move each grouped task to parent row on row collapse.

    default: `group`

Attributes can be defined for a specific `Row` or `Task` object using an object property named `groups`

    {
      ...
      // Inside Row or Task object
      // Full options object
      'groups': {
        'enabled': <Boolean>,
        'display': '...',
        'from': '<Date>', // force from date to this value
        'to': '<Date>' // force to date to this value
      }

      // Or shortcut for enabled property
      'groups': <Boolean>
    }

## API

### Methods
    
- **api.groups.refresh()**

    Refresh hierarchy of groups based on model.
