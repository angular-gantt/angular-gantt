# Get Started

## Install Automatically

- This requires [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [bower](https://bower.io/)

- Download and install `angular-gantt` using one of the supported package manager.

    [Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) is the recommended and stable version.

        yarn add angular-gantt --save
    
    [Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

        yarn add angular-gantt#master --save
        
## Install using CDNs

1. You can find released version on CDNs.

    [jsDelivr](http://www.jsdelivr.com/)
    
        //cdn.jsdelivr.net/angular.gantt/latest/angular-gantt.min.css
    
    [CDNjs](http://www.cdnjs.com/) (Replace `<version>` with latest github tag)
    
        //cdnjs.cloudflare.com/ajax/libs/angular-gantt/<version>/angular-gantt.min.css
    
2. Add `angular-gantt.min.js` and `angular-gantt.min.css` URLs to your HTML code.

        <head>
          <link rel="stylesheet" href="//cdn.jsdelivr.net/angular.gantt/latest/angular-gantt.min.css"/>
        </head>
        <body>
          <script src="//cdn.jsdelivr.net/angular.gantt/latest/angular-gantt.min.js"></script>
        </body>

## Install Manually

1. Install [dependencies](faq.md#what-are-the-dependencies) in your application.

2. Download angular-gantt or use CDNs.
    [Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) is available to 
    [download](https://github.com/angular-gantt/angular-gantt/releases/latest) on Github and is the recommended and stable version.
        
    [Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

3. Copy `angular-gantt.js` and `angular-gantt.css` located in `dist` directory to your application source folder.

4. Add `angular-gantt.js` and `angular-gantt.css` files to your HTML code.

        <head>
          <link rel="stylesheet" href="dist/angular-gantt.css"/>
        </head>
        <body>
          <script src="dist/angular-gantt.js"></script>
        </body>

## Usage

1. Register `gantt` in your application dependencies.

        var myApp = angular.module('myApp', ['gantt']);

2. Put `gantt` directive into your HTML code at the position you would like to show the Gantt chart.

        <div gantt data=data></div>

3. Define data variable in your scope to start using gantt through two-way binding.

        $scope.data = [
            {name: 'row1', tasks: [
                {name: 'task1', from: <date>, to: <date>},
                {name: 'task2', from: <date>, to: <date>}
                ]
            },
            {name: 'row2', tasks: [
                {name: 'task3', from: <date>, to: <date>},
                {name: 'task4', from: <date>, to: <date>}
              ]
            },
          ...
        ]

4. \[Optional\] You can load [plugins](configuration/plugins.md) like 
  [table](plugins/table.md) to display row names on left side, 
  [movable](plugins/movable.md) to make tasks movable and resizable with mouse and touch events, and 
  [tooltips](plugins/tooltips.md) to enable tooltips on mouse over.

        var myApp = angular.module('myApp', ['gantt', 'gantt.table', 'gantt.movable', 'gantt.tooltips']);
        
    <!-- -->
    
        <div gantt data=data>
          <gantt-table></gantt-table>
          <gantt-movable></gantt-movable>
          <gantt-tooltips></gantt-tooltips>
        </div>

5. For a sample app see the files in `demo` or [Plunker](http://plnkr.co/XYYkD8tf5b2LQs5kL5nx).
