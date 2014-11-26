# Draw Task

Draw new tasks with the mouse.

## Usage

    angular.module('myApp', ['gantt', 'gantt.drawtask']);

<!-- -->

    <div gantt>
        <gantt-movable enabled="true",
                       task-factory="drawTaskFactory">
        <gantt-movable/>
    </div>
 
<!-- -->
   
    $scope.drawTaskFactory = function() {
        var newTask = {
            id: 5,
            name: 'New Task'
            // Other properties
        }
       
        return newTask;
    }

## Attributes

- ### enabled

    Enable drawing.
    
    default: `true`

- ### task-factory

    Factory method which creates the task. The factory method is called when the user is starting to draw a task. Supported task properties according to [Data](../configuration/data.md). `From` and `To` properties are set by the plugin and there is no need in specifying them.
    
    default: `undefined`
