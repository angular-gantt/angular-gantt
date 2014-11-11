# Tooltips

Display tooltips when moving mouse over a task.

## Usage

    angular.module('myApp', ['gantt', 'gantt.tooltips']);

<!-- -->

    <gantt>
        <gantt-tooltips enabled="..." date-format="..."><gantt-tooltips/>
    </gantt>

<!-- -->
    
    <link rel="stylesheet" href="angular-gantt-tooltips.css">

## Attributes

- ### enabled

    Enable display of tooltips.
    
    default: `true`

- ### date-format

    Format of the dates displayed in tooltip.
    
    See [momentJS#format()](http://momentjs.com/docs/#/displaying/format/)
    
    default: `MMM DD, HH:mm`

Attributes can be defined for a specific `Row` or `Task` object using an object named `tooltips`

    {
      ...
      // Inside Row or Task object
      'tooltips': {
        'enabled': <Boolean>,
        'dateFormat': <string>
      }
    }
