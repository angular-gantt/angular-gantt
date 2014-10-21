# angular-gantt [![npm version](http://img.shields.io/npm/v/angular-gantt.svg)](https://npmjs.org/package/angular-gantt) [![build status](http://img.shields.io/travis/angular-gantt/angular-gantt.svg)](https://travis-ci.org/angular-gantt/angular-gantt)
##The gantt chart directive for AngularJS

 - [Demo](#demo)
 - [Features](#features)
 - [Dependencies](#dependencies)
 - [Install](#install)
 - [Usage](#commit)
 - [MomentJS](#momentjs)
 - [Run from sources](#run-from-sources)
 - [Build](#build)
 - [Attributes](#attributes)
 - [Objects](#objects)
 - [Events](#events)
 - [Contribute](#contribute)
 - [License](#license)

### <a name="demo"></a> Demo

###<a href="http://angular-gantt.github.io/angular-gantt/index.html" target="_blank">Latest Release Stable Demo</a>

###<a href="http://rawgit.com/angular-gantt/angular-gantt/master/demo/dist/index.html" target="_blank">Master Branch Unstable demo</a>

### <a name="features"></a> Features
- Usable with or without Bootstrap 3
- Every task has its own color, name, date (from, to)
- Tasks can be moved and resized
- Rows combine multiple tasks and can have independent names
- Rows and tasks can be sorted and filtered
- A user can drag&drop a row to sort it in custom mode
- Events on scroll, click, add or update
- Configurable (Any scale, (non)working time frames and days, ...)

### <a name="dependencies"></a> Dependencies
- [AngularJS](https://angularjs.org)
- [angular-moment](https://github.com/urish/angular-moment) ([momentJS](http://momentjs.com/) wrapper)

### <a name="install"></a> Install

#### Automatically (Using [bower](http://bower.io/), [grunt](http://gruntjs.com/) & [grunt-wiredep](https://github.com/stephenplusplus/grunt-wiredep))

1. Download and install `angular-gantt`.

    [Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) can be installed in your project using [bower](http://bower.io/)

        bower install angular-gantt --save
    
    [Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

        bower install angular-gantt#master --save

2. Wiredep your dependencies to automatically add [assets/angular-gantt.js](assets/angular-gantt.js) and [assets/gantt.css](assets/gantt.css) files to your HTML index, with all 
other dependencies declared in your project.

        grunt wiredep

#### Manually

1. Install all [dependencies](#dependencies) in your application (That's why you should use [bower](http://bower.io/)).

2. Download angular-gantt.
    [Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) is available to 
    [download](https://github.com/angular-gantt/angular-gantt/releases/latest) on Github. 
    
    [Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

3. Copy the files [assets/angular-gantt.js](assets/angular-gantt.js) and [assets/gantt.css](assets/gantt.css).

4. Add the [assets/angular-gantt.js](assets/angular-gantt.js) and [assets/gantt.css](assets/gantt.css) files to your HTML code.

        <head>
            <link rel="stylesheet" href="assets/gantt.css"/>
        </head>
        <body>
            <script src="assets/angular-gantt.js"></script>
        </body>

5. For a sample app see the files [demo/app/index.html](demo/app/index.html) and 
   [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js).

### <a name="usage"></a> Usage

1. Include the module `gantt` to your Angular app modules.

        var myApp = angular.module('myApp', ['gantt']);
2. Put directive `gantt` into your HTML code at the position you would like to show the Gantt chart.

        <gantt></gantt>
3. Any operation on the Gantt (like loading data) must be made after the chart has been initialized. 
The event 'event:gantt-ready' can be used to get notified as soon as it's ready.

   ```js
    $scope.$on('event:gantt-ready', function() {
        // Start using the Gantt e.g. load data
    };
    ```

### <a name="run-from-sources"></a> Run from sources

Bower can link your local sources in demo project.

    bower link 
    cd demo
    bower link angular-gantt
    
This will create a symbolic link in `demo/bower_components` pointing to your local sources of `angular-gantt`.

Then, run `grunt serve` from `demo` directory to run the demo.

### <a name="build"></a> Build
1. Install (http://gruntjs.com/)(http://gruntjs.com/)
2. Run `npm install` to install node dependencies
3  Run `bower install` to install bower dependencies
4. Run `grunt` to build angular-gantt.js and angular-gantt.min.js
5. Run `grunt` from `demo` directory to build demo distribution

### <a name="momentjs"></a> MomentJS

angular-gantt use [angular-moment](https://github.com/urish/angular-moment), an angularJS wrapper for [momentJS](http://momentjs.com/). 
For any features related to date, like date formats, week numbering, custom calendars and timezone support, please
review those projects documentations.

### <a name="attributes"></a> Attributes
- **auto-expand** (default `none`)

  Define if the date range will be extended when the user scroll to the left or right edge.
  - `both`
  - `left`
  - `right`
  - `none`
  
- **allow-labels-resizing** (default `true`)

  Row label section can be resized.

- **allow-task-moving** (default `true`)

  Tasks can be moved inside a row.

- **allow-task-resizing** (default `true`)

  Tasks can be resized.

- **allow-task-row-switching** (default: `true`)

  Tasks can be moved to a different row.

- **allow-row-sorting** (default `true`)

  Rows can be manually sorted by drag and drop. This will set `sort-mode` to `custom` as soon as the user
  starts sorting.

- **center-date**

  Function (`fn`) called to center the specified date.

  Usage:
  Specify the gantt property:
    `center-date="scrollToDate = fn"`

  In your code call:
    `$scope.scrollToDate(new Date());`

- **current-date** (default `line`)

  How current date is displayed.
  - `none`
  - `line`
  - `column`

- **current-date-value** (default to system current date)

  Current date in the chart.

  Usage:
  Specify the gantt property:
    `current-date="getToday"`

  In your code call:
    `$scope.getToday = new Date();`

- **clear-data**

  Function (`fn`) called to removes all rows and tasks at once.
  Take a look at demo files [demo/app/index.html](demo/app/index.html) and 
  [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js) to see how this callback is used.

- **column-width** (default `30`)

  How wide are the columns in `px`. This allows you add logic like `column-width="scale == 'day' ?  50 : 20"` to 
  have wider columns for days than for other column scales.

- **filter-task**, **filter-task-comparator**

  Expression to filter on visible tasks using angularJS `$filter('filter')`. 
  Value of `filter-task` is `expression`, and `filter-task-comparator` is `comparator`
  as defined in [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter).

- **filter-row**, **filter-row-comparator**

  Expression to filter on visible rows using angularJS `$filter('filter')`.
  Value of `filter-row` is `expression`, and `filter-row-comparator` is `comparator`
  as defined in  [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter)).

- **from-date**

  Ensures that the chart rendering starts at this date. This is useful for showing the chart even without any tasks, or 
  empty time before the first task, or truncate previous tasks.

- **to-date**

  Ensures that the chart rendering goes at least to this date. This is useful for showing the chart even without any 
  tasks, or empty time after the last task, or truncate next tasks.

- **data**

  Specify the data model for the gantt chart. 
    
  See [objects section](#objects).

- **headers**

  Array of headers to display.
    - `second`
    - `minute`
    - `hour`
    - `day`
    - `week`
    - `month`
    - `quarter`
    - `year`
    
  Example:
    ```js
    ['month', 'week', 'day'];
    ```

- **headers-formats**

  Associative array of headers format. Key is the header, and value is the format.
  
  Example:
  ```js
  {'year': 'YYYY', 'quarter': '[Q]Q YYYY', month: 'MMMM YYYY', week: 'w', day: 'D', hour: 'H', minute:'HH:mm'};
  ```
    
  See [momentJS#format()](http://momentjs.com/docs/#/displaying/format/)

- **labels-width** (default: `0` = Auto)

  Width of label section on the left side of the Gantt. This property support two way binding. Therefore if the user
  resizes the label section any assigned scope variable will be updated too.

- **show-labels-column** (default: `true`)

  Whether the column with labels is to be shown or not. This attribute support two way binding, hence the visibility
  of the column may be toggled.
  
- **time-frames**, **date-frames**

  TimeFrames and DateFrames are used to configure global calendar in the gantt.

  A TimeFrame is a part of day, for example 8H00-20H00 or 12H00-13H30. Each TimeFrame can be marked as working or not.
  A TimeFrame can also be marked as default to be used for every day displayed in the gantt.
  
  A DateFrame is a configuration object that will reference one or many TimeFrame names for specific days in the
  calendar. Using DateFrame configurations, it's possible to setup holidays, weekends and other special days that will
  have different time schedules than usual.
  
  Example:
    ```html
    <gantt calendar-time-frames="timeFrames" calendar-date-frames="dateFrames"></gantt>
    ```
  
    ```js
    $scope.timeFrames = {day: {
                            start: moment('8:00', 'HH:mm'),
                                end: moment('20:00', 'HH:mm'),
                                working: true, // This is a working period
                                default: true // It will be used for each day
                            },
                         noon: {
                             start: moment('12:00', 'HH:mm'),
                             end: moment('13:30', 'HH:mm'),
                             working: false, // This is a resting period
                             default: true // It will be used for each day
                         },
                         closed: {
                             working: false // We don't work when it's closed
                         }
                       };
    
    $scope.dateFrames = {halloween:{
                           date: moment('2014-10-31', 'YYYY-MM-DD'), // A specific date
                           targets: ['day'] // Use timeFrame named day for halloween. We won't close for noon.
                        },
                        holidays: {
                            start: moment('2014-08-15', 'YYYY-MM-DD'), // A date range
                            end: moment('2014-08-30', 'YYYY-MM-DD'),
                            targets: ['closed'] // use timeFrame named closed for this date range.
                        }, 
                        weekend: {
                            evaluator: function(date) { // A custom function evaluated for each day in the gantt
                                return date.isoWeekday() === 6 || date.isoWeekday() === 7;
                            },
                            targets: ['closed'] // Use timeFrame named closed for saturday and sunday.
                        };

    ```
  
  In this example, three TimeFrames (`day`, `noon`, `closed`) and three DateFrames (`halloween`, `holidays`, `weekend`) 
  are defined.
  
  If a day match at least one DateFrame, it will apply TimeFrames defined in `targets` property of each matching
  DateFrame. If no DateFrame at all match the day, it will use `default` TimeFrames (`day` and `noon`).
  
  When multiple TimeFrames are found for a day, smaller ones have priority and bigger ones will be split or shrinked.
  
  After resolution of TimeFrame for each day, TimeFrame can be displayed or cropped from the gantt using
  `calendar-working-mode` and `calendar-non-working-mode`.

- **load-data**

  Function (`fn`) called to load more data to the Gantt.
  Take a look at demo files [demo/app/index.html](demo/app/index.html) and 
  [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js) to see how this callback is used.
  
  An example of the data definition can be found in [demo sample file](demo/app/scripts/services/sample.js).

  As an alternative, you can use the `data` property to directly assign the data model.

- **load-timespans**

  Function (`fn`) called to load timespans into the Gantt.
  Take a look at demo files [demo/app/index.html](demo/app/index.html) and 
  [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js) to see how this callback is used.

  An example of the data definition can be found in [demo sample file](demo/app/scripts/services/sample.js).

  As an alternative, you can use the `timespans` property to directly assign the data model.

- **max-height** (default: `0` = Disabled)

  Maximum height of the Gantt. It will show a vertical scroll bar if the content does not fit inside.

- **remove-data**

  Function (`fn`) called to remove more data from the Gantt. It is possible to remove complete rows or specific tasks.
  Take a look at demo files [demo/app/index.html](demo/app/index.html) and 
  [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js) to see how this callback is used.

- **show-tooltips** (default: `true`)

  Show tooltip when the user hovers over a task.

- **sort-mode** (default: `name`)

  Sorts the rows by given expression.
  - `name`: Sort by row name
  - `from`: Sort by the earliest task from date of each row
  - `to`: Sort by the latest task to date of each row
  - `custom`: Sort by a property called **order** on each row
  - `<expression>`: Sort using an angularJS expression (see [angularJS orderBy filter](https://docs.angularjs.org/api/ng/filter/orderBy)).

  Prepend a `-` in front to sort descending. E.g. `-date`

- **task-out-of-range** (default: `expand`)

  Behavior when tasks are defined out of the Gantt rendering range (see from-date and to-date).
  - `expand`: rendering range will be expanded to display the tasks entirely.
  - `truncate`: tasks will be truncated, or even totally hidden if they are not in rendering range at all.

- **template-url**

  URL of custom Gantt HTML template. If you want to customize the default Gantt HTML template, make a copy of [default
  template file](src/template/default.gantt.tmpl.html) to your own project, and set
  the URL of copied file to this attribute. 
    
  If `undefined` or `template/default.gantt.tmpl.html`, default template will be used.   
  
  *warning:* template-url must be different than `template/default.gantt.tmpl.html`, or it will use default
  template included in `angular-gantt.js`.
  
  To use default template, you don't have to copy [default template file](src/template/default.gantt.tmpl.html) to 
  your project, default template is loaded in 
  [$templateCache](https://docs.angularjs.org/api/ng/service/$templateCache) when initializing `gantt` module.

- **tooltip-date-format**

  Format of the dates displayed in tooltip.
  
  See [momentJS#format()](http://momentjs.com/docs/#/displaying/format/)

- **view-scale** (default: `day`)

  Column scale using any of [momentJS#add()](http://momentjs.com/docs/#/manipulating/add/) supported unit.
  - `second`
  - `minute`
  - `hour`
  - `day`
  - `week`
  - `month`
  - `quarter`
  - `year`

- **width** (default: `0` = Disabled)

  Width of the gantt in `px`. If defined, `columns-width` will have no effect.

### <a name="objects"></a> Objects
  An example of the data definition can be found in [demo sample file](demo/app/scripts/services/sample.js).

- **Row**
```js
{
    id: "...",  // Unique id of the row.
    name: "...", // Name shown on the left side of each row.
    order: <Number> // Row order for custom sort mode. Should be a unique number if defined (Optional). Tip: Property can be left away for default behaviour.
    tasks: [] // Array containing the row tasks to add.
}
```

- **Task**
```js
{
    id: "...",  // Unique id of the task.
    name: "...", // Name shown on top of each task.
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

- **Timespan**
```js
{
    id: "...",  // Unique id of the timespan.
    name: "...", // Name shown on top of each timespan.
    from: <Date>, // Date can be a String, Timestamp or Date object.
    to: <Date>, // Date can be a String, Timestamp or Date object.
    color: "..." , // Color of the timespan in HEX format (Optional).
    classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
}
```

### <a name="events"></a> Events

Angular-gantt emits many events using native AngularJS [$scope.$on(name, listener)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on).

    $scope.$on('event:gantt-<event-name>', function(evt, data) {
        // Implement this callback to perform what you need
        // ...
    })`;

All event names are prefixed with `event:gantt-`. You can also use constants by injecting
`GANTT_EVENTS` from `gantt` module.

- **ready**

  Gantt is initialized and ready to load data.

- **scroll**

  The user scrolls to the left or right side of the chart. Use this event to load more data on the fly.

- **task-added**, **task-changed**

  A task has been added or changed

- **task-clicked**, **task-dblclicked**, **task-contextmenu**

  A task has been clicked, double clicked or right clicked.

- **task-move-begin**, **task-move**, **task-move-end**

  A task is starting to move, moving or has stopped moving.

- **task-resize-begin**, **on-task-resize**, **on-task-resize-end**

  A task is starting to resize, moving or has stopped moving.

- **timespan-added**, **timespan-changed**

  A timespan has been added or changed.
  
- **row-added** and **row-changed**

  A row has been added or changed. A row is changed if the custom sort order has been changed by the user.

- **row-clicked**, **row-dblclicked**, **row-contextmenu**, **row-mousedown**, **row-mouseup**

  A row has been clicked, double clicked, right clicked, mouse downed or mouse upped.

- **column-clicked**, **column-dblclicked**, **column-contextmenu**
  
  A column header has been clicked, double clicked or right clicked.

- **row-label-clicked**, **row-label-dblclicked**, **row-label-contextmenu**, **row-label-mousedown**, **row-label-mouseup**

  A row label has been clicked, double clicked, right clicked, mouse downed or mouse upped.

- **row-header-clicked**, **row-header-dblclicked**, **row-header-contextmenu**, **row-header-mousedown**, **row-header-mouseup**

  A row header has been clicked, double clicked, right clicked, mouse downed or mouse upped.

- **row-labels-resized**

  Row labels have been resized.

### <a name="contribute"></a> Contribute

See [Contributing Guidelines](CONTRIBUTING.md)

### <a name="license"></a> License
**The MIT License**

Copyright (c) 2014 Marco Schweighauser, Rémi Alvergnat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
