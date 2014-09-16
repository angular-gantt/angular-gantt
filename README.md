# Gantt chart for Angular.js
A Gantt chart directive for Angular.js without any other dependencies.

####<a href="http://schweigi.github.io/angular-gantt/index.html" target="_blank">TRY THE DEMO</a>

### Features
- Usable with or without Bootstrap 3
- Every task has its own color, subject, date (from, to)
- Tasks can be moved and are resizable
- Rows combine multiple tasks and can have independent descriptions
- Rows can be sorted by description, date and custom order
- A user can drag&drop a row to sort it in custom mode
- Events on scroll, click, add or update
- Configurable (e.g. day or hour scale, weekend days, ..)

### Missing / To improve
- Add support for US week numbers. Currently all week numbers are according to ISO 8106.

### Requires
- Angular.js >= 1.2.16

### Usage
Copy the files [assets/angular-gantt.js](assets/angular-gantt.js), [assets/gantt.css](assets/gantt.css) and [template/gantt.tmpl.html](template/gantt.tmpl.html) to your project. For a sample app see the files [demo.html](demo.html) and [assets/demo.js](assets/demo.js).

1. Add the [gantt.js](assets/angular-gantt.js) and [gantt.css](assets/gantt.css) files to your HTML code.

        <head><link rel="stylesheet" href="assets/gantt.css"/></head>
        <body><script src="assets/angular-gantt.js"></script></body>
2. Include the module `gantt` to your Angular app modules.

        var myApp = angular.module('myApp', ['gantt']);
3. Put directive `gantt` into your HTML code at the position you would like to show the Gantt chart.

        <gantt></gantt>
        
4. Any operation on the Gantt (like loading data) must be made after the chart has been initialized. The event 'on-gantt-ready' can be used to get notified as soon as this is the case.
        
        HTML:
        <gantt on-gantt-ready="ganttInitialized()"></gantt>
        
        Javascript:
        $scope.ganttInitialized = function() {
            // Start using the Gantt e.g. load data
        };

### How to build
1. Install [Grunt](http://gruntjs.com/getting-started)
2. Run `npm install` to install all dependencies
3. Run `grunt` to build angular-gantt.js and angular-gantt.min.js

Hint: Use `grunt watch` to build angular-gantt.js on the fly during development.

### How to contribute
1. Create a feature branch with a meaning full name based on the 'develop' branch
2. Make all your changes inside this feature branch and make sure that those changes have been made in the source JS files and not in the generated angular-gantt.js file. See also chapter "How to build".
3. After you finished adjust the README and sample app
4. Create a pull-request for your feature branch

### Attributes
- **auto-expand** (default `none`)

  The Gantt date range will be extended if the user scroll to the left or right edge. Possible values are `both`, `left`, `right` or `none`.
  
- **allow-labels-resizing** (default `true`)

  Defines if the user can resize the row label section by himself.

- **allow-task-moving** (default `true`)

  Defines if tasks can be moved inside a row.

- **allow-task-resizing** (default `true`)

  Defines if tasks can be resized.

- **allow-task-row-switching** (default: `true`)

  If enabled the user can move a task to a different row.

- **allow-row-sorting** (default `true`)

  Defines if the user can sort the rows by himself. This will switch the `view-mode` to `custom` as soon as the user starts with the sort.

- **center-date**

  Returns a function (`fn`) which can be called to center the specified date.

  Usage:
  Specify the gantt property:
    `center-date="scrollToDate = fn"`

  In your code call:
    `$scope.scrollToDate(new Date());`

- **clear-data**

  Returns a function (`fn`) which can be called to removes all rows and tasks at once.
  Take a look at the files [demo.html](demo.html) and [demo.js](assets/demo.js) to see how this callback is used.

- **column-width** (default `2`)

  How wide are the columns, 1 being 1em. This allows you add logic like `column-width="scale == 'day' ?  5 : 2"` to have wider columns for days than for other column scales.

- **column-sub-scale** (default: `4`)

  Defines how precise tasks should be positioned. By default tasks are placed in quarter steps (every 8 hour or 15 minute).
  Some examples:
  - 4 = in quarter steps
  - 2 = in half steps
  - 24 (if view-scale = day) to display them very accurate

- **first-day-of-week** (default: `1`)

  Specifies the first day of the week.
  - `0`: Sunday
  - `1`: Monday
  - `2`: Tuesday
  - `3`: Wednesday
  - `4`: Thursday
  - `5`: Friday
  - `6`: Saturday

- **from-date**

  If specified ensures that the chart is rendered starts at the from-date. This is useful for showing the chart even without any tasks or empty time before the first task.

  *Note: At this time this does not truncate the tasks, so you will have to do that to your data*

- **to-date**

  If specified ensures that the chart is rendered goes at least to the end-date. This is useful for showing the chart even without any tasks or empty time after the last task.

  *Note: At this time this does not truncate the tasks, so you will have to do that to your data*

- **data**

  Allows you to specify the data model for the gantt chart. An example of the data definition can be found in [demo\_sample\_data.js](assets/demo_sample_data.js).

- **labels-width** (default: `0` = Auto)

  This property defines the width of the label section on the left side of the Gantt. This property support two way binding. Therefore if the user resizes the label section any assigned scope variable will be updated too.

- **load-data**

  Returns a function (`fn`) which can be called to load more data to the Gantt.
  Take a look at the files [demo.html](demo.html) and [demo.js](assets/demo.js) to see how this callback is used. An example of the data definition can be found in [demo\_sample\_data.js](assets/demo_sample_data.js).

  As an alternative you can use the `data` property to directly assign the data model.

- **max-height** (default: `0` = Disabled)

  If max height is set bigger than 0 the Gantt will be set to this height and show a vertical scroll bar if the content does not fit inside.

- **on-gantt-ready**

  This event is raised when the Gantt is initialized and ready to load data.

- **on-label-clicked**, **on-label-dbl-clicked**, **on-label-context-clicked**

  This event is raised if the user clicks on a row label. Use the `evt` property on the event to access the original javascript event.

- **on-label-header-clicked**, **on-label-header-dbl-clicked**, **on-label-header-context-clicked**

  This event is raised if the user clicks on the label header in the top section of the Gantt. Use the `evt` property on the event to access the original javascript event.

- **on-labels-resized**

  This event is raised after the user did resize the row label section.

- **on-row-added** and **on-row-updated**

  Those events are raised if a new row is added or updated. A row is updated if the custom sort order has been changed by the user.

- **on-row-clicked**, **on-row-dbl-clicked**, **on-row-context-clicked**

  This event is raised if the user clicks on a row. The event has a `row`, `date`, `column` and `evt` property you can use to detect the date clicked or to access the original javascript event.

- **on-scroll**

  This event is raised if the user scrolls to the left or right side of the Gantt chart. Use this event to load more data on the fly.

- **on-task-clicked**, **on-task-dbl-clicked**, **on-task-context-clicked**

  This event is raised if the user clicks on a task. Use the `evt` property on the event to access the original javascript event.

- **on-task-updated**

  This event is raised if the user moves or resizes a task.

- **on-task-move-begin**, **on-task-move-end**

  This event is raised if when a user starts moving a task and when the move finished.

- **on-task-resize-begin**, **on-task-resize-end**

  This event is raised if when a user starts resizing a task and when the resize operation is finished.

- **remove-data**

  Returns a function (`fn`) which can be called to remove more data from the Gantt. It is possible to remove complete rows or specific tasks.
  Take a look at the files [demo.html](demo.html) and [demo.js](assets/demo.js) to see how this callback is used.

- **show-tooltips** (default: `true`)

  Display a tooltip when the user hovers over a task.

- **show-weekend** (default: `true`)

  Display the weekend days if enabled. Weekend days are displayed different than non weekend days.

- **show-non-work-hours** (default: `true`)

  Display the non work hours if enabled. Non work hours displayed different than work hours. Increase the `view-scale-factor` if you disable this parameter and use view-scale = day as there are less hours displayed per day.

- **sort-mode** (default: `name`)

  Sorts the rows by the given value.
  - `name`: Sort by row description
  - `date`: Sort by the earliest task `from` date of each row
  - `custom`: Custom sort order using a property called **order** on each row

  Prepend a `-` in front to sort descending. E.g. `-date`

- **template-url** (default: `template/gantt.tmpl.html`)

  URL of the Gantt HTML template. You need to specify this attribute if you put the template in a different folder otherwise the directive won't work.

- **view-scale** (default: `day`)

  Defines the Gantt column scale.
  - `hour`: Each column is one hour wide
  - `day`: Each column is one day wide
  - `week`: Each column is one week wide
  - `month`: Each column is one month wide

- **weekend-days** (default: `[0,6]`)

  Array containing all weekend days. Assign an empty array `[]` if you don't want any weekend days at all. Example:
  - `[0,6]`: Sunday, Saturday

- **work-hours** (default: `[8,9,10,11,12,13,14,15,16]`)

  Array containing all working hours. Non working hours are displayed differently than working hours. Example:
  - `[8,9,10,11,12,13,14,15,16]`: Working hours are from 8am to 5pm.

### Row and task object properties
#### Row
```js
{
    id: "...",  // Unique id of the row.
    description: "...", // Description shown on the left side of each row.
    order: <Number> // Row order for custom sort mode. Should be a unique number if defined (Optional). Tip: Property can be left away for default behaviour.
    tasks: [] // Array containing the row tasks to add.
}
```

#### Task
```js
{
    id: "...",  // Unique id of the task.
    subject: "...", // Subject shown on top of each task.
    from: <Date>, // Date can be a String, Timestamp or Date object.
    to: <Date>, // Date can be a String, Timestamp or Date object.
    color: "..." , // Color of the task in HEX format (Optional).
    classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
    priority: <Number> // Defines which of an overlapping task is on top (Optional). Tip: Leave property away for default behaviour.
    est: <Date> // When est and lct are defined a time window will be displayed around the task (Optional).
    lct: <Date> // See "est".
    data: <Any> // Custom object. Use this to attach your own data (Optional).
}
```

### License
**The MIT License**

Copyright (c) 2014 Marco Schweighauser

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
