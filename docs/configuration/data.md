# Data

[data](attributes.md#data) is the [attribute](attributes.md) used to load data into `angular-gantt`.

This attribute support two-way binding. Modifications made to `data` will automatically be displayed in `angular-gantt`,
and modification made to `angular-gantt` will be applied to `data`.

`data` is a list of `Row` objects. Each `Row` object contains a list of `Task` object defined in `tasks` property. 

## Row

    {
      id: "...",  // Unique id of the row (Optional).
      name: "...", // Name shown on the left side of each row.
      height: "..." // Height of the row (Optional).
      color: "..." , // Color of the task in HEX format (Optional).
      classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
      tasks: [] // Array containing <Task> tasks to add in this row.
    }


## Task

    {
      id: "...",  // Unique id of the task (Optional).
      name: "...", // Name shown on top of each task.
      from: <Date>, // Date can be a String, Timestamp, Date object or moment object.
      to: <Date>, // Date can be a String, Timestamp, Date object or moment object.
      color: "..." , // Color of the task in HEX format (Optional).
      classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
      priority: <Number> // Defines which of an overlapping task is on top (Optional). Tip: Leave property away for default behaviour.
      data: <Any> // Custom object. Use this to attach your own data (Optional).
    }

## Example

    <gantt data=data></gantt>

<!-- -->

    $scope.data = [{name: 'Milestones', height: '3em', sortable: {enabled: false}, classes: 'gantt-row-milestone', color: '#45607D', data: 'Can contain any custom data or object',
      tasks: [
        {name': 'Kickoff', color: '#93C47D', from: '2013-10-07T09:00:00', 
          to: '2013-10-07T10:00:00', data: 'Can contain any custom data or object'},
        {name': 'Concept approval', color: '#93C47D', from: new Date(2013, 9, 18, 18, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0), est: new Date(2013, 9, 16, 7, 0, 0), lct: new Date(2013, 9, 19, 0, 0, 0)},
        {name': 'Development finished', color: '#93C47D', from: new Date(2013, 10, 15, 18, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
        {name': 'Shop is running', color: '#93C47D', from: new Date(2013, 10, 22, 12, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)},
        {name': 'Go-live', color: '#93C47D', from: new Date(2013, 10, 29, 16, 0, 0), to: new Date(2013, 10, 29, 16, 0, 0)}
    ]},
    {name: 'Status meetings', tasks: [
        {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0)},
        {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0)},
        {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0)},
        {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
        {name: 'Demo', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0)}
    ]},
    {name: 'Kickoff', movable: {allowResizing: false}, tasks: [
        {name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
            progress: {percent: 100, color: '#3C8CF8'}, movable: {enabled: false}},
        {name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
            progress: {percent: 100, color: '#3C8CF8'}},
        {name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
            progress: {percent: 100, color: '#3C8CF8'}}
    ]},
    {name: 'Create concept', tasks: [
        {name: 'Create concept', color: '#F1C232', from: new Date(2013, 9, 10, 8, 0, 0), to: new Date(2013, 9, 16, 18, 0, 0), est: new Date(2013, 9, 8, 8, 0, 0), lct: new Date(2013, 9, 18, 20, 0, 0),
            progress: 100}
    ]},
    {name: 'Finalize concept', tasks: [
        {name: 'Finalize concept', color: '#F1C232', from: new Date(2013, 9, 17, 8, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0),
            progress: 100}
    ]},
    {name: 'Sprint 1', tooltips: {enabled: false}, tasks: [
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
        {name: 'Login&Singup and admin view', color: '#F1C232', from: new Date(2013, 10, 11, 8, 0, 0), to: new Date(2013, 10, 15, 15, 0, 0)}
    ]},
    {name: 'Setup server', tasks: [
        {name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0)}
    ]},
    {name: 'Config server', tasks: [
        {name: 'SW / DNS/ Backups', color: '#F1C232', from: new Date(2013, 10, 18, 12, 0, 0), to: new Date(2013, 10, 21, 18, 0, 0)}
    ]},
    {name: 'Deployment', tasks: [
        {name: 'Depl. & Final testing', color: '#F1C232', from: new Date(2013, 10, 21, 8, 0, 0), to: new Date(2013, 10, 22, 12, 0, 0)}
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

*This example use additional [plugins](../plugins/plugins.md) data.*
