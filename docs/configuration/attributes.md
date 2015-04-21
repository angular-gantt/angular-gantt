# Attributes

`gantt` directive can be configured using attributes. Each attribute is interpreted as 
[AngularJS Expression](https://docs.angularjs.org/guide/expression).

- ### api

    Registers an API Object to call methods of the component and listen or raise events.
  
    See [API](#api) for more details.
    
        <div gantt api="registerApi"></div>
    
    <!-- -->
        
        $scope.registerApi = function(api) {
          api.core.on.ready() {
            // Call API methods and register events.
          }
        }

- ### auto-expand

    Define if the date range will be extended when the user scroll to the left or right edge.
    
    - `both`
    - `left`
    - `right`
    - `none`

- ### allow-side-resizing

    Side section can be resized.
    
    default: `true`

- ### current-date

    How current date is displayed.
    
    - `none`
    - `line`
    - `column`
    
    default: `line`

- ### current-date-value

    Current date in the chart.
    
        <div gantt current-date="getToday"></div>
      
    <!-- -->
      
        $scope.getToday = new Date();
    
    default: `new Date()`

- ### column-width

    The width of each column in `px`. This allows you add logic like `column-width="viewScale == 'day' ?  50 : 20"` to 
    have wider columns for days than for other column scales.
    
    If `undefined`, gantt will always fit available width.

- ### expand-to-fit, shrink-to-fit

    Ensure that gantt is expanded/shrinked to fit the available width, even if `column-width` value is defined.

- ### column-magnet

    Precision of the column. All date and time computation will be rounded using this precision. It will also snap
    to borders of timeFrames and columns is `time-frames-magnet` is `true`.
    
    Format is `<integer> <momentjs-unit>`. See [momentJS#add()](http://momentjs.com/docs/#/manipulating/add/) for 
    a list of supported unit.
    
    If `column-magnet` value is greater than `view-scale` or defined to `column` value, it will apply magnets to 
    column borders. You can't defined a `column-magnet` value that covers multiple columns.
    
    Examples:
    
    - `column`
    - `1 minute`
    - `30 minutes`
    - `1 hour`
    - `3 hours`
    
    default: `15 minutes`

- ### shift-column-magnet

    Precision of the column when holding down SHIFT key.

    If undefined, it will use 0.25 viewScale.

- ### time-frames-magnet

    Make timeFrame borders snap. Columns magnet must be enabled too.
    
    default: `true`

- ### daily

    Fill up view of tasks by rounding their `from`/`to` date to the start/end of day.

- ### data

    The [data](data.md) model for the gantt chart. 
      
    See [Data](data.md) for more information.

- ### filter-task, filter-task-comparator

    Expression to filter on visible tasks using angularJS `$filter('filter')`.
    
    Value of `filter-task` is `expression` (`string`|`Object`|`function(value, index)`)),
    and `filter-task-comparator` is `comparator` (`function(actual, expected)`|`boolean`|`undefined`)
    as defined in [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter).
  
    When using a function, call [api.rows.refresh()](#api-rows-refresh) to refresh filtering when required.

- ### filter-row, filter-row-comparator

    Expression to filter on visible rows using angularJS `$filter('filter')`.
    
    Value of `filter-row` is `expression` (`string`|`Object`|`function(value, index)`)), 
    and `filter-row-comparator` is `comparator` (`function(actual, expected)`|`boolean`|`undefined`)
    as defined in  [angularJS filter filter](https://docs.angularjs.org/api/ng/filter/filter)).
  
    When using a function, call [api.rows.refresh()](#api-rows-refresh) to refresh filtering when required.

- ### from-date

    Ensures that the chart rendering starts at this date. This is useful for showing the chart even without any tasks, or 
    empty time before the first task, or truncate previous tasks.

- ### to-date

    Ensures that the chart rendering goes at least to this date. This is useful for showing the chart even without any 
    tasks, or empty time after the last task, or truncate next tasks.

- ### headers

    Array of headers to display.
  
      - `second`
      - `minute`
      - `hour`
      - `day`
      - `week`
      - `month`
      - `quarter`
      - `year`
      
    <!-- -->
    
        <div gantt headers="['month', 'week', 'day']"></div>

- ### headers-formats

    Associative object of headers format. Key is the header, and value is the format.
    
    See [momentJS#format()](http://momentjs.com/docs/#/displaying/format/)
    
        <div gantt headers-formats="headersFormats"></div>
      
    <!-- -->
    
        $scope.headersFormats = { 
          'year': 'YYYY', 
          'quarter': '[Q]Q YYYY', 
          month: 'MMMM YYYY', 
          week: 'w', 
          day: 'D', 
          hour: 'H', 
          minute:'HH:mm'
        };
        
    It is also possible to specify a function to format the header label.
    
        $scope.headersFormats = { 
          week: function(column) {
            return column.date.format('Do [-]') + column.endDate.format('Do') + column.date.format(' [(W]w[)]');
          }
        };

- ### time-frames, date-frames

    TimeFrames and DateFrames are used to configure global calendar in the gantt.
  
    A TimeFrame is a part of day, for example 8H00-20H00 or 12H00-13H30. Each TimeFrame can be marked as working or not.
    A TimeFrame can also be marked as default to be used for every day displayed in the gantt.
    
    A DateFrame is a configuration object that will reference one or many TimeFrame names for specific days in the
    calendar. Using DateFrame configurations, it's possible to setup holidays, weekends and other special days that will
    have different time schedules than usual.
    
        <div gantt time-frames="timeFrames" date-frames="dateFrames"></div>

    <!-- -->
  
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
                                magnet: false, // This will disable magnet snapping
                                working: false, // This is a resting period
                                default: true // It will be used for each day
                            },
                            closed: {
                                magnet: false, // This will disable magnet snapping
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
  
    In this example, three TimeFrames (`day`, `noon`, `closed`) and three DateFrames (`halloween`, `holidays`, `weekend`) 
    are defined.
    
    If a day match at least one DateFrame, it will apply TimeFrames defined in `targets` property of each matching
    DateFrame. If no DateFrame at all match the day, it will use `default` TimeFrames (`day` and `noon`).
    
    When multiple TimeFrames are found for a day, smaller ones have priority and bigger ones will be split or shrinked.
    
    After resolution of TimeFrame for each day, TimeFrame can be displayed or cropped from the gantt using
    `time-frames-working-mode` and `time-frames-non-working-mode`.
    
    You can also add `color` and `classes` properties on TimeFrame object to define custom style on displayed timeFrames.
    
        closed: {
             working: false // We don't work when it's closed
             color: 'green' // Display in green because green is a nice color :)
             classes: ['gantt-closed-timeframe'] // Give one or many class names to customize using CSS.       
         }

- ### time-frames-working-mode

    How working TimeFrames are displayed.
    
    - `visible`
    - `hidden`
    - `cropped`
        
     default: `hidden`

- ### time-frames-non-working-mode

    How non-working TimeFrames are displayed.
      
    - `visible`
    - `hidden`
    - `cropped`
        
    default: `visible`

- ### timespans

    The [timespans](timespans.md) model for the gantt chart. 
      
    See [Timespans](timespans.md) for more information.

- ### max-height

    Maximum height of the Gantt. It will show a vertical scroll bar if the content does not fit inside.
  
- ### options
  
    Configure the gantt using as a plain old javascript object, keys of `options` representing the configuration
    attributes. camelCased version of attributes must be used as key (`autoExpand` instead of `auto-expand`).
  
        <div gantt options="options"></div>
    
    <!-- -->
  
        $scope.options = {
          data: [...],
          api: function(api) {
            ...
          },
          ...
        }

- ### show-side

    Show the side section. Make sure that a side section plugin (e.g. [Tree](../plugins/tree.md) or [Table](../plugins/table.md)) 
    is activated otherwise the side section is not shown.
        
    default: `true`

- ### side-width

    Width of the side section. You can also set side `width`, `min-width` and `max-width` using 
    `.gantt-side` CSS selector.

- ### sort-mode

    Sorts the rows by given expression.
  
    - `model.name`: Sort by row name
    - `from`: Sort by the earliest task from date of each row
    - `to`: Sort by the latest task to date of each row
    - `<expression>`: Sort using an angularJS expression (see [angularJS orderBy filter](https://docs.angularjs.org/api/ng/filter/orderBy)).
  
    Prepend a `-` in front to sort descending. E.g. `-from`

- ### row-content

    Content used to display each row. It can contain HTML and will be automatically compiled and linked against Row
    object scope. Main user scope is available with `scope`.
    
    It can be modified for a specific row using [Row model](data.md) `content` property

    default: `{{row.model.name}}`
    
    example: ``<i class="fa fa-align-justify" ng-click="scope.handleRowIconClick(row.model)"></i> {{row.model.name}}``

- ### task-out-of-range

    Behavior when tasks are defined out of the Gantt rendering range (see `from-date` and `to-date`).
  
    - `expand`: rendering range will be expanded to display the tasks entirely.
    - `truncate`: tasks will be truncated, or even totally hidden if they are not in rendering range at all.
    
    default: `expand`

- ### task-content

    Content used to display each task. It can contain HTML and will be automatically compiled and linked against Task
    object scope. Main user scope is available with `scope`.
    
    It can be modified for a specific task using [Task model](data.md) `content` property

    default: `{{task.model.name}}`
    
    example: ``<i class="fa fa-cog" ng-click="scope.handleTaskIconClick(task.model)"></i> {{task.model.name}}``

- ### template

    Custom Gantt HTML template. If you want to customize the default Gantt HTML template, copy the content of
    template file `src/template/gantt.tmpl.html` to a variable and set this parameter. 
    
    Compared to `template-url`, this will avoid an additional request to load the template from an URL.
    
    This attribute is not observed and not evaluated as an expression.

- ### template-url

    URL of custom Gantt HTML template. If you want to customize the default Gantt HTML template, make a copy of default
    template file `src/template/gantt.tmpl.html` to your own project, and set the URL of copied file to this
    attribute. 
      
    If `undefined` or `template/gantt.tmpl.html`, default template will be used.   
    
    This attribute is not observed and not evaluated as an expression.
    
    *note: template-url must be different than `template/gantt.tmpl.html`, or it will use default
    template included in `angular-gantt.js`.*
    
- ### view-scale

    Column scale using any of [momentJS#add()](http://momentjs.com/docs/#/manipulating/add/) supported unit.

    - `second`
    - `minute`
    - `hour`
    - `day`
    - `week`
    - `month`
    - `quarter`
    - `year`

    An optional number value can be prepended to this scale, like `5 minutes`, `3 hours` or `6 months`.
    
    default: `day`
