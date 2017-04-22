# Progress

Display a visual indicator showing configured progress of tasks.

## Usage

    angular.module('myApp', ['gantt', 'gantt.progress']);

<!-- -->

    <div gantt>
        <gantt-progress enabled="..."></gantt-progress>
    </div>

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

- ### template

    Template to use for progress element.
    
    This attribute is not observed and not evaluated as an expression.

- ### template-url

    URL of template to use for progress element.

    If `undefined` or `plugins/progress/taskProgress.tmpl.html`, default template will be used.
    
    This attribute is not observed and not evaluated as an expression.
    
    *note: template-url must be different than `plugins/progress/taskProgress.tmpl.html`, or it will use default
    template included in `angular-gantt-plugins.js` or `angular-gantt-progress.js`.*
