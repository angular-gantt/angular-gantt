# Get Started

## Install Automatically

*This requires [bower](http://bower.io/), [grunt](http://gruntjs.com/) & [grunt-wiredep](https://github.com/stephenplusplus/grunt-wiredep)*

1. Download and install `angular-gantt`.

    [Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) is the recommended and stable version.

        bower install angular-gantt --save
    
    [Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

        bower install angular-gantt#master --save

2. Wiredep your dependencies to automatically add `angular-gantt.js` and `angular-gantt.css` files to your HTML index, with all 
other dependencies declared in your project.

        grunt wiredep
        
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

3. \[Optional\] Some features of angular-gantt are optional and defined in [Plugins](configuration/plugins.md). 
Add `angular-gantt-plugins.min.js` and `angular-gantt-plugins.min.css` URLs to your HTML code (after core sources).

    [jsDelivr](http://www.jsdelivr.com/)
    
        //cdn.jsdelivr.net/angular.gantt/latest/angular-gantt-plugins.min.css
    
    [CDNjs](http://www.cdnjs.com/) (Replace `<version>` with latest github tag)
    
        //cdnjs.cloudflare.com/ajax/libs/angular-gantt/<version>/angular-gantt-plugins.min.css

    <!-- -->

        <head>
          <link rel="stylesheet" href="//cdn.jsdelivr.net/angular.gantt/latest/angular-gantt.min.css"/>
          <link rel="stylesheet" href="//cdn.jsdelivr.net/angular.gantt/latest/angular-gantt-plugins.min.css"/>
        </head>
        <body>
          <script src="//cdn.jsdelivr.net/angular.gantt/latest/angular-gantt.min.js"></script>
          <script src="//cdn.jsdelivr.net/angular.gantt/latest/angular-gantt-plugins.min.js"></script>
        </body>
        
    *Some plugins require additional dependencies.*

## Install Manually

1. Install [dependencies](faq.md#what-are-the-dependencies) in your application (That's why you should use [bower](http://bower.io/)).

2. Download angular-gantt or use CDNs.
    [Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) is available to 
    [download](https://github.com/angular-gantt/angular-gantt/releases/latest) on Github and is the recommended and stable version.
        
    [Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

3. Copy `angular-gantt.js` and `angular-gantt.css` located in `assets` directory to your application source folder.

4. Add `angular-gantt.js` and `angular-gantt.css` files to your HTML code.

        <head>
          <link rel="stylesheet" href="assets/angular-gantt.css"/>
        </head>
        <body>
          <script src="assets/angular-gantt.js"></script>
        </body>

5. \[Optional\] Some features of angular-gantt are optional and defined in [Plugins](configuration/plugins.md). 
Add `angular-gantt-plugins.js` and `angular-gantt-plugins.css` files to your HTML code (after core sources).

        <head>
          <link rel="stylesheet" href="assets/angular-gantt.css"/>
          <link rel="stylesheet" href="assets/angular-gantt-plugins.css"/>
        </head>
        <body>
          <script src="assets/angular-gantt.js"></script>
          <script src="assets/angular-gantt-plugins.js"></script>
        </body>

    *Some plugins require additional dependencies.*

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

5. For a sample app see the files in `demo/app/` or [Plunker](http://plnkr.co/hchknn).
