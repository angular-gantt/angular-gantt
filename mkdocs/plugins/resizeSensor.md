# Resize Sensor

Use [CSS-Element-Queries Polyfill](https://github.com/marcj/css-element-queries) to support dynamic 
resizing of the component.

## Dependency

[css-element-queries](https://github.com/marcj/css-element-queries)

## Usage

    angular.module('myApp', ['gantt', 'gantt.resizeSensor']);

<!-- -->

    <div gantt>
      <gantt-resize-sensor enabled="...">
      </gantt-resize-sensor>
    </div>

## Attributes

- #### enabled

    Enable resize sensor using [css-element-queries](https://github.com/marcj/css-element-queries).

    default: `true`
