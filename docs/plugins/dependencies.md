# Dependencies

Add support for dependency links between tasks using [jsPlumb](https://jsplumbtoolkit.com/).

## Dependency

[jsPlumb](https://jsplumbtoolkit.com/)

## Usage

    angular.module('myApp', ['gantt', 'gantt.dependencies']);

<!-- -->

    <div gantt>
        <gantt-dependencies enabled="true"
                            jsPlumbDefaults="{
                                             Anchors: ['Right', 'Left'],
                                             Endpoint: ['Dot', {radius: 7}],
                                             Connector: 'Flowchart'
                                             }">
        </gantt-dependencies>
    </div>


## Attributes

- ### enabled

    Enable dependencies support.

    default: `true`

- ### jsPlumbDefaults

    Default settings object for the underlying jsPlumb instance. See 
    [Configuring Defaults](https://jsplumbtoolkit.com/community/doc/defaults.html) of 
    [jsPlumb documentation](https://jsplumbtoolkit.com/community/doc/home.html).
    
    default: 

        {
        Anchors: ['Right', 'Left'],
        Endpoint: ['Dot', {radius: 7}],
        Connector: 'Flowchart'
        }

## Model

Task can specify a `dependencies` field containing a single or a list of objects.

Each object defines the opposite side or the dependency, using either `from` or `to` property. `connectParameters` field
can optionnaly be set to an object that will be used for each related 
[jsPlumb.connect(...)](https://jsplumbtoolkit.com/community/doc/connections.html#programmatic) function call.

    {
      ...
      // Inside Task object
      'dependencies': {
        'from': <taskId>,
        'connectParameters': {...} // Parameters given to jsPlumb.connect() function call.
      }]
    }

    {
      ...
      // Inside Task object
      'dependencies': {
        'to': <taskId>,
        'connectParameters': {...} // Parameters given to jsPlumb.connect() function call.
      }
    }

## API

### Events
  
- Soon ...
