# Data

[data](attributes.md#data) is the [attribute](attributes.md) used to load data into `angular-gantt`.

This attribute support two-way binding. Modifications made to `data` will automatically be displayed in `angular-gantt`,
and modification made to `angular-gantt` will be applied to `data`.

`data` is a list of `Row` objects. Each `Row` object contains a list of `Task` object defined in `tasks` property. 

## Row

    {
      name: "...", // Name shown on the left side of each row.
      id: "...",  // Unique id of the row (Optional).
      height: "..." // Height of the row (Optional).
      color: "..." , // Color of the task in HEX format (Optional).
      classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
      content: "...", // Content used in labels (Optional).
      tasks: [] // Array containing <Task> tasks to add in this row.
    }

## Task

    {
      name: "...", // Name shown on top of each task.
      from: <Date>, // Date can be a String, Timestamp, Date object or moment object.
      to: <Date>, // Date can be a String, Timestamp, Date object or moment object.
      id: "...",  // Unique id of the task (Optional).
      color: "..." , // Color of the task in HEX format (Optional).
      classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
      priority: <Number> // Defines which of an overlapping task is on top (Optional). Tip: Leave property away for default behaviour.
      data: <Any> // Custom object. Use this to attach your own data (Optional).
      content: "...", // Content used in labels (Optional).
    }

## CSS Selectors

CSS Classes defined in model with `classes` property are applied to multiple elements for each row and task. 

Using single class selector like `.custom-row` or `.custom-task` may not work as expected. You should use following selectors.

### Row selectors

Define `custom-row` class in the row model.

    {
      name: "Some row",
      classes: "custom-row",
      tasks: [...]
    }

Use the following selectors to customize this particular row.

    .gantt-row.custom-row .gantt-row-background {
      // Customize background of the row
      background: blue;
      opacity: 0.3;
    }
    
    .gantt-row.custom-row .gantt-row-content {
      // Customize content of the row
      weight: bolder;
    }

### Task selectors

Define `custom-task` class in the task model.

    {
      name: "Some task",
      classes: "custom-task",
    }

Use the following selectors to customize this particular task.

    .gantt-task.custom-task .gantt-task-background {
      // Customize background of the task
      background: blue;
      opacity: 0.3;
    }
    
    .gantt-task.custom-task .gantt-task-content {
      // Customize content of the task
      weight: bolder;
    }
    
    .gantt-task.custom-task .gantt-task-foreground {
      // Customize foreground of the task
    }

## Example

    <div gantt data=data></div>

<!-- -->

    $scope.data = [{name: 'Milestones', height: '3em', sortable: false, classes: 'gantt-row-milestone', color: '#45607D', tasks: [
                       // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
                       {name: 'Kickoff', color: '#93C47D', from: '2013-10-07T09:00:00', to: '2013-10-07T10:00:00', data: 'Can contain any custom data or object'},
                       {name: 'Concept approval', color: '#93C47D', from: new Date(2013, 9, 18, 18, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0), est: new Date(2013, 9, 16, 7, 0, 0), lct: new Date(2013, 9, 19, 0, 0, 0)},
                       {name: 'Development finished', color: '#93C47D', from: new Date(2013, 10, 15, 18, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
                       {name: 'Shop is running', color: '#93C47D', from: new Date(2013, 10, 22, 12, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)},
                       {name: 'Go-live', color: '#93C47D', from: new Date(2013, 10, 29, 16, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
                   ], data: 'Can contain any custom data or object'},
                   {name: 'Status meetings', tasks: [
                       {name: 'Demo #1', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0)},
                       {name: 'Demo #2', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0)},
                       {name: 'Demo #3', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0)},
                       {name: 'Demo #4', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
                       {name: 'Demo #5', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0)}
                   ]},
                   {name: 'Kickoff', movable: {allowResizing: false}, tasks: [
                       {name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
                           progress: {percent: 100, color: '#3C8CF8'}, movable: false},
                       {name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
                           progress: {percent: 100, color: '#3C8CF8'}},
                       {name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
                           progress: {percent: 100, color: '#3C8CF8'}}
                   ]},
                   {name: 'Create concept', tasks: [
                       {name: 'Create concept', content: '<i class="fa fa-cog" ng-click="scope.handleTaskIconClick(task.model)"></i> {{task.model.name}}', color: '#F1C232', from: new Date(2013, 9, 10, 8, 0, 0), to: new Date(2013, 9, 16, 18, 0, 0), est: new Date(2013, 9, 8, 8, 0, 0), lct: new Date(2013, 9, 18, 20, 0, 0),
                           progress: 100}
                   ]},
                   {name: 'Finalize concept', tasks: [
                       {name: 'Finalize concept', color: '#F1C232', from: new Date(2013, 9, 17, 8, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0),
                           progress: 100}
                   ]},
                   {name: 'Development', children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'], content: '<i class="fa fa-file-code-o" ng-click="scope.handleRowIconClick(row.model)"></i> {{row.model.name}}'},
                   {name: 'Sprint 1', tooltips: false, tasks: [
                       {name: 'Product list view', color: '#F1C232', from: new Date(2013, 9, 21, 8, 0, 0), to: new Date(2013, 9, 25, 15, 0, 0),
                           progress: 25}
                   ]},
                   {name: 'Sprint 2', tasks: [
                       {name: 'Order basket', color: '#F1C232', from: new Date(2013, 9, 28, 8, 0, 0), to: new Date(2013, 10, 1, 15, 0, 0)}
                   ]},
                   {name: 'Sprint 3', tasks: [
                       {name: 'Checkout', color: '#F1C232', from: new Date(2013, 10, 4, 8, 0, 0), to: new Date(2013, 10, 8, 15, 0, 0)}
                   ]},
                   {name: 'Sprint 4', tasks: [
                       {name: 'Login & Signup & Admin Views', color: '#F1C232', from: new Date(2013, 10, 11, 8, 0, 0), to: new Date(2013, 10, 15, 15, 0, 0)}
                   ]},
                   {name: 'Hosting'},
                   {name: 'Setup', tasks: [
                       {name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0)}
                   ]},
                   {name: 'Config', tasks: [
                       {name: 'SW / DNS/ Backups', color: '#F1C232', from: new Date(2013, 10, 18, 12, 0, 0), to: new Date(2013, 10, 21, 18, 0, 0)}
                   ]},
                   {name: 'Server', parent: 'Hosting', children: ['Setup', 'Config']},
                   {name: 'Deployment', parent: 'Hosting', tasks: [
                       {name: 'Depl. & Final testing', color: '#F1C232', from: new Date(2013, 10, 21, 8, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0), 'classes': 'gantt-task-deployment'}
                   ]},
                   {name: 'Workshop', tasks: [
                       {name: 'On-side education', color: '#F1C232', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 25, 15, 0, 0)}
                   ]},
                   {name: 'Content', tasks: [
                       {name: 'Supervise content creation', color: '#F1C232', from: new Date(2013, 10, 26, 9, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
                   ]},
                   {name: 'Documentation', tasks: [
                       {name: 'Technical/User documentation', color: '#F1C232', from: new Date(2013, 10, 26, 8, 0, 0), to: new Date(2013, 10, 28, 18, 0, 0)}
                   ]}]

*This example use additional [plugins](plugins.md) data.*
