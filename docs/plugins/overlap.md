# Overlap

Add a border with `gantt-task-overlaps` CSS class on tasks that overlaps.

## Dependency

[moment-range](https://github.com/gf3/moment-range)

## Usage

    angular.module('myApp', ['gantt', 'gantt.overlap']);

<!-- -->

    <div gantt>
        <gantt-overlap enabled="true">
        </gantt-overlap>
    </div>

## Attributes

- ### enabled

    Enables overlap detection functionality. Can also be a function (`fn(event)`) which has one parameter for the event. Such a function can be used to only activate the overlap detection when a certain mouse button is pressed or the task is in a certain condition.
    
    default: `true`
