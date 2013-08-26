# Gantt chart for Angular.js
A Gantt chart directive for Angular.js without any other dependencies.

####<a href="http://schweigi.github.io/angular-gantt/index.html" target="_blank">TRY THE DEMO</a>

### Features
- Usable with or without Bootstrap 3
- Every task has its own color, subject, date (from, to)
- Rows combine multiple tasks and can have independent descriptions
- Rows can be sorted by description, date and custom order
- A user can drag&drop a row to sort it in custom mode
- Events on scroll, add or update
- Configurable

### Missing / To improve
- Possibility for the user to add or update rows / tasks (by drag&drop)
- Add support for US week numbers. Currently all week numbers are according to ISO 8106.
- If new rows / tasks are added on scrolling during a fast horizontal mouse wheel scroll it is possible that the current view position is not kept.

### Usage
Copy the files [js/gantt.js](js/gantt.js), [css/gantt.css](css/gantt.css) and [template/gantt.tmpl.html](template/gantt.tmpl.html) to your project. For a sample app see the files [demo.html](demo.html) and [demo.js](js/demo.js).

1. Add the [gantt.js](js/gantt.js) and [gantt.css](css/gantt.css) files to your HTML code.

        <head><link rel="stylesheet" href="css/gantt.css"/></head>
        <body><script src="js/gantt.js"></script></body>
2. Include the module `gantt` to your Angular app modules.

        var myApp = angular.module('myApp', ['gantt']);
3. Put directive `gantt` into your HTML code at the position you would like to show the Gantt chart.

        <gantt></gantt>

### Attributes
- **first-day-of-week** (default: `1`)

  Specifies the first day of the week.
  - `0`: Sunday
  - `1`: Monday
  - `2`: Tuesday
  - `3`: Wednesday
  - `4`: Thursday
  - `5`: Friday
  - `6`: Saturday

- **load-data**

  Returns a function (`fn`) which can be called to load more data to the Gantt.
  Take a look at the files [demo.html](demo.html) and [demo.js](js/demo.js) to see how this callback is used. An example of the data definition can be found in [demo\_sample\_data.js](js/demo_sample_data.js).

- **on-row-added** and **on-row-updated**

  Those events are raised if a new row is added or updated. A row is updated if the custom sort order has been changed by the user.

- **on-scroll**

  This event is raised if the user scrolls to the left or right side of the Gantt chart. Use this event to load more data on the fly.

- **remove-data**

  Returns a function (`fn`) which can be called to remove more data from the Gantt. It is possible to remove complete rows or specific tasks.
  Take a look at the files [demo.html](demo.html) and [demo.js](js/demo.js) to see how this callback is used.

- **sort-mode** (default: `name`)

  Sorts the rows by the given value.
  - `name`: Sort by row description
  - `date`: Sort by the earliest task `from` date of each row
  - `custom`: Custom sort order using a property called **order** on each row

- **template-url** (default: `template/gantt.tmpl.html`)

  URL of the Gantt HTML template. You need to specify this attribute if you put the template in a different folder otherwise the directive won't work.

- **view-scale** (default: `day`)

  Defines the Gantt column scale.
  - `day`: Each column is one day wide
  - `hour`: Each column is one hour wide

- **weekend-days** (default: `[0,6]`)

  Array containing all weekend days. Assign an empty array `[]` if you don't want any weekend days at all. Example:
  - `[0,6]`: Sunday, Saturday

### License
**The MIT License**

Copyright (c) 2013 Marco Schweighauser

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
