# Bounds

Display configured bounds when moving mouse over a task.

## Usage

    angular.module('myApp', ['gantt', 'gantt.bounds']);
    
<!-- -->

    <div gantt>
        <gantt-bounds enabled="..."></gantt-bounds>
    </div>

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

- ### template
 
    Template to use for bounds element.
     
    This attribute is not observed and not evaluated as an expression.

- ### template-url

    URL of template to use for bounds element.

    If `undefined` or `plugins/bounds/taskBounds.tmpl.html`, default template will be used.

    This attribute is not observed and not evaluated as an expression.
    
    *note: template-url must be different than `plugins/bounds/taskBounds.tmpl.html`, or it will use default
    template included in `angular-gantt-plugins.js` or `angular-gantt-bounds.js`.*
