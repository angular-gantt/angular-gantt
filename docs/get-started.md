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

## Install Manually

1. Install [dependencies](faq.md#what-are-the-dependencies) in your application (That's why you should use [bower](http://bower.io/)).

2. Download angular-gantt.
    [Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) is available to 
    [download](https://github.com/angular-gantt/angular-gantt/releases/latest) on Github and is the recommended and stable version.
    
    You can also find released version on [CDNjs](http://www.cdnjs.com/) and [jsDelivr](http://www.jsdelivr.com/)
    
    [Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

3. Copy `angular-gantt.js` and `angular-gantt.css` located in `assets` directory to your application source folder.

4. Add `angular-gantt.js` and `angular-gantt.css` files to your HTML code.

        <head>
          <link rel="stylesheet" href="assets/angular-gantt.css"/>
        </head>
        <body>
          <script src="assets/angular-gantt.js"></script>
        </body>

## Usage

1. Register `gantt` in your application dependencies.

        var myApp = angular.module('myApp', ['gantt']);

2. Put `gantt` directive into your HTML code at the position you would like to show the Gantt chart.

        <gantt data=data></gantt>

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

4. For a sample app see the files in `demo/app/`.
