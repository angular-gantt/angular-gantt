# Progress

Display a visual indicator showing configured progress of tasks.

## Usage

    angular.module('myApp', ['gantt', 'gantt.progress']);

<!-- -->

    <gantt>
        <gantt-progress enabled="..."><gantt-progress/>
    </gantt>

<!-- -->

    <link rel="stylesheet" href="angular-gantt-progress.css">

To show the progress indicator, you need to a add `progress` object property inside the Task object.

    {
      name: "...",
      from: <Date>,
      to: <Date>,
      progress: <Number|Progress> // The progress of this task, as a percent number or a <Progress> object (Optional).
    }

### Progress Object

    {
      percent: <Number> // Percentage of advancement, from 0 to 100.
      color: "...", Color of the completion bar in HEX format
      classes: [], Array of class name to apply to progress bar
    }

## Attributes

- ### enabled

    Enable display of progress bars.
  
    default: `true`
