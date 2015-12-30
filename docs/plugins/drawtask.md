# Draw Task

Draw new tasks with the mouse.

## Dependency

Requires [movable plugin](movable.md).

## Usage

    angular.module('myApp', ['gantt', 'gantt.drawtask']);

<!-- -->

    <div gantt>
        <gantt-draw-task enabled="true"
                       task-factory="drawTaskFactory">
        </gantt-draw-task>
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

    Enable drawing. Can also be a function (`fn(event)`) which has one parameter for the event. Such a function can be used to only activate the drawing when a certain mouse button is pressed.
    
    default: `true`
    
- ### move-threshold

    Threshold of how many pixel the user must move the mouse before the drawing begins. This is use full to differentiate between a single mouse click and drawing. Recommended value is `1-3`.

    default: `0`

- ### task-factory

    Factory method which creates the task. The factory method is called when the user is starting to draw a task. Supported task properties according to [Data](../configuration/data.md). `From` and `To` properties are set by the plugin and there is no need in specifying them.
    
    default: `undefined`
