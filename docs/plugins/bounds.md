# Bounds

Display configured bounds when moving mouse over a task.

## Usage

    angular.module('myApp', ['gantt', 'gantt.bounds']);
    
<!-- -->

    <gantt>
        <gantt-bounds enabled="..."><gantt-bounds/>
    </gantt>

<!-- -->

    <link rel="stylesheet" href="angular-gantt-bounds.css">

To define bounds on a task, you need to add `est` and `lct` property on task object model.

    {
      name: "...",
      from: <Date>,
      to: <Date>,
      est: <Date> // When est and lct are defined a time window will be displayed around the task (Optional).
      lct: <Date> // See "est".
    }


## Attributes

- ### enabled

    Enable display of bounds box.
  
    default: `true`
