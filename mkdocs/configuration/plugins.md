# Plugins

Plugins are additional features that are not included in `angular-gantt` main distribution file.
They can be configured using attributes defined for each plugin, and some plugins may use additional properties from
[data](attributes.md#data).

Each plugin is available under `assets` folder as standalone `angular-gantt-xxxxxx.js` and `angular-gantt-xxxxxx.css`
files, where `xxxxxx` plugin is the name of the plugin.

`angular-gantt-plugins.js` and `angular-gantt-plugins.css` files contains every standard plugin as a single package. 

## Enable a plugin

1. Add the plugin module dependency to your application module dependencies list.

        angular.module('myApp', ['gantt', 'gantt.xxxxxx']);

2. Add the plugin directive as a child element of the gantt directive.

        <div gantt>
            <gantt-xxxxxx></gantt-xxxxxx>
        </div>

## Supported plugins

- ### [Table](../plugins/table.md)

    Display row labels in multiple columns on the side.

- ### [Tree](../plugins/tree.md)

    Display a tree hierarchy for rows.

- ### [Sortable](../plugins/sortable.md)

    Sort rows by drag & drop on rows label.

- ### [Movable](../plugins/movable.md)

    Move and resize tasks.

- ### [Draw Task](../plugins/drawtask.md)

    Draw new tasks with the mouse.

- ### [Progress](../plugins/progress.md)

    Display a visual indicator showing configured progress of tasks.

- ### [Bounds](../plugins/bounds.md)

    Display configured bounds when moving mouse over a task.
    
- ### [Overlap](../plugins/overlap.md)

    Add a border with `gantt-task-overlaps` CSS class on tasks that overlaps.

- ### [Tooltips](../plugins/tooltips.md)

    Display tooltips when moving mouse over a task.

- ### [Resize Sensor](../plugins/resizeSensor.md)

    Use [CSS-Element-Queries Polyfill](https://github.com/marcj/css-element-queries) to support dynamic resizing.

- ### [Labels](../plugins/labels.md) **DEPRECATED**

    Display row labels on the side. (Use [Table](../plugins/table.md) plugin instead)
