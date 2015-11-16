# Tooltips

Display tooltips when moving mouse over a task.

## Usage

    angular.module('myApp', ['gantt', 'gantt.tooltips']);

<!-- -->

    <div gantt>
        <gantt-tooltips enabled="..." date-format="..."></gantt-tooltips>
    </div>

<!-- -->
    
    <link rel="stylesheet" href="angular-gantt-tooltips.css">

## Attributes

- ### enabled

    Enable display of tooltips.
    
    default: `true`

- ### date-format

    Format of the dates displayed in tooltip.
    
    See [momentJS#format()](http://momentjs.com/docs/#/displaying/format/)
    
    default: `MMM DD, HH:mm`

- ### delay

    Delay in millisecond before the tooltip is displayed.
    
    default: `500`

- ### content

    Content of the tooltip. It can contain HTML and will be automatically compiled.

    default:
    
        '{{task.model.name}}</br>' +
        '<small>' +
        '{{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}' +
        '</small>'

- ### template

    Template to use for tooltip element.
    
    This attribute is not observed and not evaluated as an expression.

- ### template-url

    URL of template to use for tooltip element.

    If `undefined` or `plugins/tooltips/tooltip.tmpl.html`, default template will be used.
    
    This attribute is not observed and not evaluated as an expression.
    
    *note: template-url must be different than `plugins/tooltips/tooltip.tmpl.html`, or it will use default
    template included in `angular-gantt-plugins.js` or `angular-gantt-tooltips.js`.*

Attributes can be defined for a specific `Row` or `Task` object using an object named `tooltips`

    {
      ...
      // Inside Row or Task object
      // Full options object
      'tooltips': {
        'enabled': <Boolean>,
        'dateFormat': <string>
      }

      // Or shortcut for enabled property
      'movable': <Boolean>
    }
