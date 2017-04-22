# Overlap

Add a border with `gantt-task-overlaps` CSS class on tasks that overlaps in same rows or through the whole gantt.

## Dependency

[moment-range](https://github.com/gf3/moment-range)

## Usage

    angular.module('myApp', ['gantt', 'gantt.overlap']);

<!-- -->

    <div gantt>
        <gantt-overlap enabled="true" global="false">
        </gantt-overlap>
    </div>

## Attributes

- ### enabled

    Enables overlap detection functionality. Can also be a function (`fn(event)`) which has one parameter for the event. Such a function can be used to only activate the overlap detection when a certain mouse button is pressed or the task is in a certain condition.
    
    default: `true`

- ### global

    Detects overlaps for tasks through whole gantt, instead of through same rows only.
    
    default: `false`
