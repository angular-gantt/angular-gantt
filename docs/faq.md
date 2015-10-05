# Frequently Asked Questions

- ### Is JQuery required ?

    No.

- ### Can i use angular-gantt without angularJS ?

    No.

- ### What are the dependencies ?

    - [AngularJS](https://angularjs.org) >= 1.3
    - [angular-moment](https://github.com/urish/angular-moment) ([momentJS](http://momentjs.com/) wrapper)
   
    Plugins may require additional dependencies:
   
    - [angular-native-dragdrop](https://github.com/ganarajpr/angular-dragdrop) >= 1.1.0 ([Sortable](plugins/sortable.md))
    - [angular-ui-tree](https://github.com/angular-ui-tree/angular-ui-tree) ([Tree](plugins/tree.md))
    - [css-element-queries](https://github.com/marcj/css-element-queries) ([ResizeSensor](plugins/resizeSensor.md))

- ### Which browser is supported ?

    Any up-to-date HTML5 browser should work properly.

- ### I have an issue with date, calendar and/or timezone ?

    angular-gantt use [angular-moment](https://github.com/urish/angular-moment), an angularJS wrapper for [momentJS](http://momentjs.com/). 
    For any features related to date, like date formats, week numbering, custom calendars and timezone support, please
    review those projects documentations.

- ### How can i set first day of week and first week of year ?

    Using [momentJS](http://momentjs.com/) API.
    
        moment.locale('en', {
          week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4 // The week that contains Jan 4th is the first week of the year.
          }
        });

- ### Is it possible to print the gantt ?

    One way to print the gantt is to use a headless browser like [PhantomJS](http://www.phantomjs.org). We prepared a 
    sample rasterize script file which can be used to print the gantt either as pdf or image.
    
    Usage: The sample script contains a small how-to. 
    Download: [printing/phantomjs/rasterize.js](https://github.com/angular-gantt/angular-gantt/blob/master/printing/phantomjs/rasterize.js)

- ### How can I get better performance ?

    Make sure that only the absolutely necessary data is loaded into the Gantt. This can be done by loading data for a limited time period (e.g. 6 months) and using the scroll events to load more tasks when the user is scrolling to the end of the active date range.
    Additionally different view modes like the `view-scale='year'` or the column width setting `column-width=undefined` do display a big amount of data at the same time. If this is not necessary then switching to a lower view scale or disabling the automatic column width calculation is recommended.
    
    When running in production we recommend to disable the Angular debug mode and to enable DI strict mode for an additional performance optimization. More about this can be found in the official AngularJS [documentation](https://code.angularjs.org/1.3.14/docs/guide/production).
