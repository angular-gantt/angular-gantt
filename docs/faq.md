# Frequently Asked Questions

- ### Is JQuery required ?

    No.

- ### Can i use angular-gantt without angularJS ?

    No.

- ### What are the dependencies ?

    - [AngularJS](https://angularjs.org) >= 1.3
    - [angular-moment](https://github.com/urish/angular-moment) ([momentJS](http://momentjs.com/) wrapper)
   
    Plugins may require additional dependencies:
   
    - [angular-native-dragdrop](https://github.com/ganarajpr/angular-dragdrop) >= 1.0.7 ([Sortable](plugins/sortable.md))

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
