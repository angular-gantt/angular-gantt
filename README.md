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
 - [API](#api)
 - [Plugins](#plugins)
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
- [AngularJS](https://angularjs.org) >= 1.3
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

  ```html
  <head>
    <link rel="stylesheet" href="assets/gantt.css"/>
  </head>
  <body>
    <script src="assets/angular-gantt.js"></script>
  </body>
  ```

5. For a sample app see the files [demo/app/index.html](demo/app/index.html) and 
   [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js).

### <a name="usage"></a> Usage

1. Include the module `gantt` to your Angular app modules.

  ```js
  var myApp = angular.module('myApp', ['gantt']);
  ```
2. Put directive `gantt` into your HTML code at the position you would like to show the Gantt chart.

  ```html
  <gantt api=ganttApi></gantt>
  ```

3. Any operation on the Gantt (like loading data) must be made after the chart has been initialized. 
The event `core.on.ready` can be used to get notified as soon as it's ready.

  ```js
  $scope.ganttApi = function(api) {
    api.core.on.ready($scope, function() {
      // Start using the Gantt e.g. load data
      api.data.load(...);
    }
  }
  ```

### <a name="run-from-sources"></a> Run from sources

Bower can link your local sources in demo project.

    bower link 
    cd demo
    bower link angular-gantt
    
This will create a symbolic link in `demo/bower_components` pointing to your local sources of `angular-gantt`.

Then, run `grunt serve` from `demo` directory to run the demo.

### <a name="build"></a> Build
1. Install [npm](https://www.npmjs.org/), [bower](http://bower.io/) and [grunt](http://gruntjs.com/)
2. Run `npm install` to install node dependencies
3. Run `bower install` to install bower dependencies
4. Run `grunt` to build angular-gantt.js and angular-gantt.min.js
5. Run `grunt` from `demo` directory to build demo distribution

### <a name="momentjs"></a> MomentJS

angular-gantt use [angular-moment](https://github.com/urish/angular-moment), an angularJS wrapper for [momentJS](http://momentjs.com/). 
For any features related to date, like date formats, week numbering, custom calendars and timezone support, please
review those projects documentations.

### <a name="attributes"></a> Attributes
- **api**

  Registers an API Object to control the component from application and listen/raise events.
  
  See [API section](#api) for more details.

- **auto-expand** (default `none`)

  Define if the date range will be extended when the user scroll to the left or right edge.
  - `both`
  - `left`
  - `right`
  - `none`
  
- **allow-labels-resizing** (default `true`)

  Row label section can be resized.

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

- **column-width**

  How wide are the columns in `px`. This allows you add logic like `column-width="scale == 'day' ?  50 : 20"` to 
  have wider columns for days than for other column scales.
  
  If `undefined`, gantt will adjust columns width to fill available space.

- **column-magnet** (default `15 minutes`)

  Precision for all user operations, like moving and resizing tasks.
  
  Format is `<integer> <momentjs-unit>`. See [momentJS#add()](http://momentjs.com/docs/#/manipulating/add/) for 
  a list of supported unit.
  
  Examples:
  - `1 minute`
  - `30 minutes`
  - `1 hour`
  - `3 hours`

- **data**

  Specify the data model for the gantt chart. 
    
  See [objects section](#objects).

- <a name="attribute-filter-task"></a>**filter-task**, **filter-task-comparator**

  Expression to filter on visible tasks using angularJS `$filter('filter')`. 
  Value of `filter-task` is `expression` (`string`|`Object`|`function(value, index)`)), and `filter-task-comparator`
  is `comparator` (`function(actual, expected)`|`boolean`|`undefined`)
  as defined in [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter).

  When using a function, call [api.rows.refresh()](#api-rows-refresh) to refresh filtering when required.

- <a name="attribute-filter-row"></a>**filter-row**, **filter-row-comparator**

  Expression to filter on visible rows using angularJS `$filter('filter')`.
  Value of `filter-row` is `expression` (`string`|`Object`|`function(value, index)`)), and `filter-row-comparator`
  is `comparator` (`function(actual, expected)`|`boolean`|`undefined`)
  as defined in  [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter)).

  When using a function, call [api.rows.refresh()](#api-rows-refresh) to refresh filtering when required.

- **from-date**

  Ensures that the chart rendering starts at this date. This is useful for showing the chart even without any tasks, or 
  empty time before the first task, or truncate previous tasks.

- **to-date**

  Ensures that the chart rendering goes at least to this date. This is useful for showing the chart even without any 
  tasks, or empty time after the last task, or truncate next tasks.

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
    <gantt time-frames="timeFrames" date-frames="dateFrames"></gantt>
    ```
  
    ```js
    $scope.timeFrames = {
                        day: {
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
    
    $scope.dateFrames = {
                        halloween:{
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
                        }
    };

    ```
  
  In this example, three TimeFrames (`day`, `noon`, `closed`) and three DateFrames (`halloween`, `holidays`, `weekend`) 
  are defined.
  
  If a day match at least one DateFrame, it will apply TimeFrames defined in `targets` property of each matching
  DateFrame. If no DateFrame at all match the day, it will use `default` TimeFrames (`day` and `noon`).
  
  When multiple TimeFrames are found for a day, smaller ones have priority and bigger ones will be split or shrinked.
  
  After resolution of TimeFrame for each day, TimeFrame can be displayed or cropped from the gantt using
  `time-frames-working-mode` and `time-frames-non-working-mode`.
  
  You can also add `color` and `classes` properties on TimeFrame object to define custom style on displayed timeFrames.
  
  ```js  
  closed: {
       working: false // We don't work when it's closed
       color: 'green' // Display in green because green is a nice color :)
       classes: ['gantt-closed-timeframe'] // Give one or many class names to customize using CSS.       
   }
  ```

- **time-frames-working-mode** (default `hidden`), 

  How working TimeFrames are displayed.
  
  - `visible`
  - `hidden`
  - `cropped`

- **time-frames-non-working-mode**

  How non-working TimeFrames are displayed. (default `visible`)
    
    - `visible`
    - `hidden`
    - `cropped`

- **max-height** (default: `0` = Disabled)

  Maximum height of the Gantt. It will show a vertical scroll bar if the content does not fit inside.
  
- **options**

  Configure the gantt using as a plain old javascript object, keys of `options` representing the configuration
  attributes. camelCased version of attributes must be used as key (`autoExpand` instead of `auto-expand`).

  ```html
  <gantt options="options"></gantt>
  ```

  ```js
  $scope.options = {
    data: {...},
    autoExpand: 'both', 
    ...
  }
  ```

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

### <a name="objects"></a> Objects
  An example of the data definition can be found in [demo sample file](demo/app/scripts/services/sample.js).

- **Row**
```js
{
    id: "...",  // Unique id of the row.
    name: "...", // Name shown on the left side of each row.
    order: <Number> // Row order for custom sort mode. Should be a unique number if defined (Optional). Tip: Property can be left away for default behaviour.
    height: "..." // Height of the row (Optional).
    color: "..." , // Color of the task in HEX format (Optional).
    classes: <Array|String> // Array or String of class names which should be applied to the task. See ng-class documentation for details (Optional).
    tasks: [] // Array containing <Task> tasks to add in this row.
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
    progress: <Number|Progress> // The progress of this task, as a percent number or a <Progress> object (Optional).
}
```

- **Progress**
```js
{
    percent: <Number> // Percentage of advancement, from 0 to 100.
    color: "...", Color of the completion bar in HEX format
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

### <a name="API"></a> API

angular-gantt has an API to control the component from application and listen/raise events.

To use this API, you need to register the API Object using `api` attribute.

  Example:
  ```html
  <gantt api="myApi"></gantt>
  ```
  
  ```js
  $scope.myApi = function(api) {
    api.core.on.ready() {
     // Load data manually ...
     api.data.loadData(...);
    }
  }
  ```

API Object contains features, like `api.core`, `api.data`, `api.rows` or `api.columns`.

Each feature has attached methods, like `api.data.load(data)` or `api.core.getDateByPosition(position)`.

On each features, `on` is used to register listeners on events, and `raise` to fire events manually.


```js
// Calling method called 'methodName' from a feature called 'featureName'.
api.featureName.methodName();

// Listening an event called 'eventName' from a feature called 'featureName'.
// $scope is required as it uses $scope.$on internally.
api.featureName.on.eventName($scope, function(data) {
    // Called when 'eventName' is raised.
});

// Raising an event called 'eventName' from a feature called 'featureName'.
api.featureName.raise.eventName(data);

```
#### Methods

##### core

- **api.core.getDateByPosition(position)**

  Retrieves the date from position in gantt.

- **api.core.getPositionByDate(date)**

  Retrieves the position in gantt from date.

##### data

- **api.data.load(data)**

  Loads more data to the Gantt.

  Take a look at demo files [demo/app/index.html](demo/app/index.html) and 
  [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js) to see how this callback is used.
  
  An example of the data definition can be found in [demo sample file](demo/app/scripts/services/sample.js).

  As an alternative, you can use the `data` property to directly assign the data model.

- **api.data.remove(data)**

  Removes data from the Gantt.
  
  It is possible to remove complete rows or specific tasks
  
  Take a look at demo files demo/app/index.html and demo/app/scripts/controllers/main.js to see how this callback is used.

- **api.data.clear()**

  Removes all rows and tasks at once.

  Take a look at demo files [demo/app/index.html](demo/app/index.html) and 
  [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js) to see how this callback is used.
  
##### timespans

- **api.timespans.load(timespans)**

  Loads timespans to the Gantt.
  
  Take a look at demo files [demo/app/index.html](demo/app/index.html) and 
  [demo/app/scripts/controllers/main.js](demo/app/scripts/controllers/main.js) to see how this callback is used.
  
  An example of the data definition can be found in [demo sample file](demo/app/scripts/services/sample.js).
  
  As an alternative, you can use the `timespans` property to directly assign the data model.

- **api.timespans.remove(timespans)**

  Removes timespans from the Gantt.

- **api.timespans.clear()**

  Removes all timespans at once.

##### columns

- **api.columns.clear()**

  Removes all columns.

- **api.columns.generate()**

  Generates all columns and display them.
  
- <a name="api-columns-refresh"></a>**api.columns.refresh()**
  
  Refresh columns and current date. It will also apply filters, and may be required if you use 
  [filter-task](#attribute-filter-task) or [filter-row](#attribute-filter-row) with a function.

##### rows

- **api.rows.sort()**

  Sort rows based on `sort-mode` value.

- **api.rows.swap(row1, row2)**

  Swap two rows. `sort-mode` must be equals to `custom`.

- <a name="api-rows-refresh"></a>**api.rows.refresh()**

  Refresh rows. It will also apply filters, and may be required if you use [filter-task](#attribute-filter-task) or
  [filter-row](#attribute-filter-row) with a function.

##### timeframes

- **api.timeframes.registerTimeFrames(timeframes)**

  Register an array of TimeFrame objects.

- **api.timeframes.clearTimeframes()**

  Removes all registered TimeFrame objects.

- **api.timeframes.registerDateFrames(timeframes)**

  Register an array of DateFrame objects.

- **api.timeframes.clearDateFrames()**

  Removes all registered DateFrame objects.

- **api.timeframes.registerTimeFrameMappings(timeframes)**

  Register an array of TimeFrameMapping objects.

- **api.timeframes.clearTimeFrameMappings()**

  Removes all registered TimeFrameMapping objects.

##### scroll

- **api.scroll.to(position)**

  Scrolls to position.

- **api.scroll.toDate(date)**

  Scrolls to date.

- **api.scroll.left(offset)**

  Moves scroll to left by offset.

- **api.scroll.right(offset)**

  Moves scroll to right by offset.

#### Events

##### core

- **api.core.on.ready(api)**

  Gantt is initialized and ready to load data.
  
##### data

- **api.data.on.load(data)**

  Data has been loaded.
  
- **api.data.on.remove(data)**

  Data has been removed.

- **api.data.on.clear()**
    
  Data has been cleared.
  
##### directives

- **api.directives.on.new(directiveName, directiveScope, element)**

  A directive has been added to the DOM.
  
- **api.directives.on.destroy(directiveName, directiveScope, element)**

  A directive will be removed from the DOM.

##### tasks

- **api.tasks.on.add(task)**, **api.tasks.on.change(task)**, **api.tasks.on.remove(task)**

  A task has been added, changed or removed
  
- **api.tasks.on.filter(tasks, filteredTasks)**

  Tasks have been filtered out.
  
##### timespans

- **api.timespans.on.add(timespan)**, **api.timespans.on.change(timespan)**, **api.timespans.on.remove(timespan)**

  A timespan has been added, changed or removed.
  
##### rows
  
- **api.rows.on.add(row)**, **api.rows.on.change(row)**, **api.rows.on.remove(row)**, **api.rows.on.orderChange(row)**

  A row has been added, changed or removed. The row changed event and row order changed event is raised if the custom sort order has been changed by the user.

- **api.rows.on.filter(rows, filteredRows)**

  Rows have been filtered out.

##### columns
  
- **api.columns.on.generate(columns, headers)**

  Columns have been generated.
  
- **api.columns.on.clear()**

  Columns have been cleared.
  
##### labels

- **api.labels.on.resize(width)**

  Row labels have been resized.

##### scroll

- **api.scroll.on.scroll(left, date, direction)**

  The user scrolls to the left or right side of the chart. Use this event to load more data on the fly.

### <a name="plugins"></a> Plugins

Plugins are additional features that are not included in [angular-gantt.js](assets/angular-gantt.js) distribution file.

Each plugin is available under [assets](assets/) folder as a standalone `angular-gantt-<plugin>.js` file.

Plugins are also available as a single packaged [angular-gantt-plugins.js](assets/angular-gantt-plugins.js) file.

To use a plugin:
 - Add the plugin module dependency to your application module in javascript.
 
 ```js
 // To load <plugin> into your application
 angular.module('myApp', ['gantt', 'gantt.<plugin>']);
 ```
 - Add the plugin directive as a child element of the gantt in html.
 
 ```html
 <gantt>
     <gantt-plugin></gantt-plugin>
 </gantt>
 ```

#### Sortable

Sort rows by drag & drop on rows label.

```js
angular.module('myApp', ['gantt', 'gantt.sortable']);
```

```html
<gantt>
    <gantt-sortable></gantt-sortable>
</gantt>
```

#### Movable

Move and resize rows.

```js
angular.module('myApp', ['gantt', 'gantt.movable']);
```

```html
<gantt>
    <gantt-movable allow-moving="true" 
                   allow-resizing="true"
                   allow-row-switching="true">
    <gantt-movable/>
</gantt>
```

#### Tooltips

Display tooltips when moving mouse over a task.

```js
angular.module('myApp', ['gantt', 'gantt.tooltips']);
```

```html
<gantt>
    <gantt-tooltips><gantt-tooltips/>
</gantt>
```

##### Attributes

- **allow-moving** (default `true`)

  Tasks can be moved inside a row.

- **allow-resizing** (default `true`)

  Tasks can be resized.

- **allow-row-switching** (default: `true`)

  Tasks can be moved to a different row.

##### Events
  
- **api.tasks.on.moveBegin(task)**, **api.tasks.on.move(task, fromRow)**, **api.tasks.on.moveEnd(task)**

  A task is starting to move, moving or has stopped moving.

- **api.tasks.on.resizeBegin(task)**, **api.tasks.on.resize(task)**, **api.tasks.on.resizeEnd(task)**

  A task is starting to resize, moving or has stopped moving.

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
