# API

angular-gantt has an API to call methods of the component and listen or raise events.

Register the API Object using `api` attribute.

    <div gantt api="registerApi"></div>

<!-- -->
    
    $scope.registerApi = function(api) {
      api.core.on.ready($scope, function () {
        // Call API methods and register events.
      });
    }

API Object contains features, like `api.core`, `api.data`, `api.rows` or `api.columns`.

Each feature has attached methods, like `api.data.load(data)` or `api.core.getDateByPosition(position)`.

On each feature, `on` object is used to register listeners, and `raise` object to fire events manually.
    
    // Listen an event called 'eventName' of a feature called 'featureName'.
    api.featureName.on.eventName($scope, function(data) {
        // Called when 'eventName' is raised.
    });
    
    // Raise an event called 'eventName' of a feature called 'featureName'.
    api.featureName.raise.eventName(data);
    
    // Call method called 'methodName' of a feature called 'featureName'.
    api.featureName.methodName();


## Events

#### core

- **api.core.on.ready(api)**

    Gantt is initialized and ready to load data.
    
- **api.core.on.rendered(api)**

    Gantt is fully rendered in browser.
  
#### data

- **api.data.on.change(newData, oldData)**
    
    Data has changed.

- **api.data.on.load(data)**

    *DEPRECATED - Use `change` event instead*
    
    Data has been loaded.
    
- **api.data.on.remove(data)**

    *DEPRECATED - Use `change` event instead*

    Data has been removed.

- **api.data.on.clear()**
    
    *DEPRECATED - Use `change` event instead*
    
    Data has been cleared.
  
#### directives

Directives events are entry points to build [Template Hooks](customize.md#template-hooks) and [Plugins](write_plugin.md).

- **api.directives.on.new(directiveName, scope, iElement, iAttrs, controller)**

    A directive instance controller will be created. It can be used to register
    [DOM Event Listener](customize.md#dom-event-listener) (`click`, `dblclick`, ...) on any directive.

- **api.directives.on.controller(directiveName, scope, iElement, iAttrs, controller)**

    A directive instance is in controller phase.

- **api.directives.on.preLink(directiveName, scope, iElement, iAttrs, controller)**

    A directive instance is in preLink phase.

- **api.directives.on.postLink(directiveName, scope, iElement, iAttrs, controller)**

    A directive instance is in postLink phase.

- **api.directives.on.destroy(directiveName, scope, iElement, iAttrs, controller)**

    A directive instance scope has been destroyed.

#### tasks

- **api.tasks.on.add(task)**, **api.tasks.on.change(task)**, **api.tasks.on.remove(task)**

    A task has been added, changed or removed
    
- **api.tasks.on.viewChange(task)**

    A task view has been changed and displayed.

- **api.tasks.on.rowChange(task, oldRow)**

    A task has been moved from one row to another.
    
- **api.tasks.on.viewRowChange(task, oldRow)**

    A task view has been moved from one row to another.

- **api.tasks.on.displayed(tasks, filteredTasks, visibleTasks)**

    Tasks have been displayed.

- **api.tasks.on.filter(tasks, filteredTasks, visibleTasks)**

    Tasks have been filtered out.
  
- **api.tasks.on.clean(taskModel)**

    Model of a task has been cleaned and will be loaded.
  
#### timespans

- **api.timespans.on.add(timespan)**, **api.timespans.on.change(timespan)**, **api.timespans.on.remove(timespan)**

    A timespan has been added, changed or removed.
  
- **api.timespans.on.clean(timespanModel)**
  
    Model of a timespans has been cleaned and will be loaded.
  
#### rows
  
- **api.rows.on.add(row)**, **api.rows.on.change(row)**, **api.rows.on.remove(row)**

    A row has been added, changed or removed.
  
- **api.rows.on.move(row, oldIndex, newIndex)**

    A row has been moved.
    
- **api.rows.on.displayed(rows, filteredRows, visibleRows)**

    Rows have been displayed.

- **api.rows.on.filter(rows, filteredRows)**

    Rows have been filtered out.
  
- **api.rows.on.clean(row)**
  
    Model of a row has been cleaned and will be loaded.

#### columns
  
- **api.columns.on.generate(columns, headers)**

    Columns have been generated.
  
- **api.columns.on.clear()**

    Columns have been cleared.
  
#### side

- **api.side.on.resizeBegin(width)**, **api.side.on.resize(width)**, **api.side.on.resizeEnd(width)**

    Side area is starting to resize, resizing or has stopped resizing.
        
#### scroll

- **api.scroll.on.scroll(left, date, direction)**

    The user scrolls to the left or right side of the chart. Use this event to load more data on the fly.


## Methods

#### core

- **api.core.getDateByPosition(position)**

    Retrieves the date from position in gantt.

- **api.core.getPositionByDate(date)**

    Retrieves the position in gantt from date.

#### data

- **api.data.load(data)**
  
    *DEPRECATED - Use `data` attribute instead*
  
    Loads more data to the Gantt.
  
    See [Data](data.md) for more information.

- **api.data.remove(data)**
  
    *DEPRECATED - Use `data` attribute instead*
  
    Removes data from the Gantt.
    
    It is possible to remove complete rows or specific tasks

- **api.data.clear()**

    *DEPRECATED - Use `data` attribute instead*

    Removes all rows and tasks at once.
  
- **api.data.get()**

    Get the data model bound to the gantt.

#### timespans

- **api.timespans.load(timespans)**
  
    Loads timespans to the Gantt.
    
    See [Timespans](timespans.md) for more information.

- **api.timespans.remove(timespans)**

    Removes timespans from the Gantt.

- **api.timespans.clear()**

    Removes all timespans at once.

#### columns

- **api.columns.clear()**

    Removes all columns.

- **api.columns.generate()**

    Generates all columns and display them.

- **api.columns.getColumnsWidth()**

    Get the actual width of the columns.

- **api.columns.getColumnsWidthToFit()**

    Get the width of the columns that would fit the gantt available width.

- **api.columns.getDateRange(visibleOnly)**

    Get the column date range. If `visibleOnly=true` then only the current visible range will be returned.
    Returns an array of two dates `[dateOfFirstColumn, endDateOfLastColumn]` or `undefined` if there are no columns.

- **api.columns.refresh()**
  
    Refresh columns and current date. It will also apply filters, and may be required if you use 
    [filter-task](attributes.md#filter-task-filter-task-comparator) or [filter-row](attributes.md##filter-row-filter-row-comparator) with a function.

#### side

- **api.side.setWidth(width)**

    Set side area width. If given `width` is `undefined`, it will be computed automatically based on content.

- **api.side.getWidth()**

    Get side area width.

#### rows

- **api.rows.sort()**

    Sort rows based on `sort-mode` value.
  
- **api.rows.applySort()**
  
    Apply the actual sort provided by `sort-mode` to gantt model data.

- **api.rows.refresh()**

    Refresh rows. It will also apply filters, and may be required if you use [filter-task](attributes.md#filter-task-filter-task-comparator) or
    [filter-row](attributes.md##filter-row-filter-row-comparator) with a function.

- **api.rows.addRowSorter(sorter)**, **api.rows.removeRowSorter(sorter)**

    Register a function that will be called to customize sorting of rows.
    
        sorter = function(rows) {
          return rows.reverse();
        }
        
        api.rows.addRowSorter(sorter);
        
        $scope.$on('$destroy', function() {
          api.rows.removeRowSorter(sorter);
        };

- **api.rows.addRowFilter(filter)**, **api.rows.removeRowFilter(filter)**

    Register a function that will be called to customize filtering of rows.

        filter = function(rows) {
          rows.pop();
          return rows;
        }
        
        api.rows.addRowFilter(filter);
        
        $scope.$on('$destroy', function() {
          api.rows.removeRowFilter(filter);
        };
        
- **api.rows.setFilterImpl(func)**

    Register a function to use for filtering.
    
    The default filtering function is based on AngularJS [$filter('filter')](https://docs.angularjs.org/api/ng/filter/filter).

        function(sortedRows, filterRow, filterRowComparator) {
          return $filter('filter')(sortedRows, filterRow, filterRowComparator);
        };

#### timeframes

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

#### scroll

- **api.scroll.to(position)**

    Scrolls to position.

- **api.scroll.toDate(date)**

    Scrolls to date.

- **api.scroll.left(offset)**

    Moves scroll to left by offset.

- **api.scroll.right(offset)**

    Moves scroll to right by offset.
