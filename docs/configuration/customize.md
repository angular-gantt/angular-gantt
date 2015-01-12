# Customize

angular-gantt is highly customizable, using either [Custom Template](#custom-template) or [Template Hooks](#template-hooks).

It use a template located in `src/template/gantt.tmpl.html`. This template is
compiled when `gantt` directive is found in your application. It contains custom `gantt-*` directives that represents
each object type you can find in the component.

## Default Template

The default template located in `src/template/gantt.tmpl.html` use many `gantt-*` directives that
gives a readable structure to the component. 

Lets review the major directives that compose this template.

- **gantt-labels** Left area of the component, containing rows labels and upper-left corner.

- **gantt-header** Top area of the components, with all columns headers.

- **gantt-body** Main area of the component, contains rows and columns, labels and headers excluded.

- **gantt-body-background** Background of `gantt-body`. It contains background of rows.

- **gantt-row-background** Background of a row.

- **gantt-body-foreground** Foreground of `gantt-body`. It contains the current date line.

- **gantt-body-columns** Container for all columns.

- **gantt-column** Column. It can contain timeFrames.

- **gantt-time-frame** TimeFrame.

- **gantt-body-rows** Container of all rows.

- **gantt-timespan** Timespan.

- **gantt-row** Row.

- **gantt-task** Task.

## Custom Template

You can use a custom template by copying the default template to your application and define `templateUrl`
attribute to the URL of this copy.

This is the easiest method to customize angular-gantt, but keep in mind you will have to update your custom template
when upgrading to a new version.

## Template Hooks

Template Hooks can be registered on any template directive.

It allows to fully customize angular-gantt without having to change the default template, making upgrade process of
easier than with a custom template.

Hooks can be installed using [api.directives.on.new](api.md#directives) event and uninstalled
using [api.directives.on.destroy](api.md#directives) event. Those events are raised when any template `gantt-*`
directive is added/removed from the DOM by AngularJS. They are entry points for [writing a Plugin](write_plugin.md).

    <div gantt api=registerApi></div>

<!-- -->

    $scope.registerApi = function(api) {
    
      api.directives.on.new($scope, function(dName, dScope, dElement, dAttrs, dController) {
        if (dName === 'xxxxxx') { // 'xxxxxx' is the 'gantt*' directive name in camelCase.
          // Use dScope, dElement, dAttrs and dController to do what you want.
        }
      });
      
    }

## Examples

### DOM Event Listener

Any DOM Event Listener (`click`, `dblclick`, ...) can be added on any `gantt-*` directive.

    api.directives.on.new($scope, function(dName, dScope, dElement, dAttrs, dController) {
      if (dName === 'ganttTask') {
        dElement.bind('click', function(event) {
            $log.info('task-click: ' + dScope.task.model);
        });
      }
    });

### Plugins

Standard plugins are good examples of what can be done using [Template Hooks](#template-hooks) and the [API](api.md). 

See sources located in `src/plugins`.
