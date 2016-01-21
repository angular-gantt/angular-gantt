# angular-gantt 
[![npm version](http://img.shields.io/npm/v/angular-gantt.svg?style=flat)](https://npmjs.org/package/angular-gantt) 
[![Build status](http://img.shields.io/travis/angular-gantt/angular-gantt.svg?style=flat)](https://travis-ci.org/angular-gantt/angular-gantt)
[![Coverage Status](https://img.shields.io/coveralls/angular-gantt/angular-gantt.svg?style=flat)](https://coveralls.io/r/angular-gantt/angular-gantt)
[![Documentation](https://readthedocs.org/projects/angular-gantt/badge/?style=flat)](https://angular-gantt.readthedocs.org)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/angular-gantt/angular-gantt?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![HuBoard](https://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/angular-gantt/angular-gantt)

## Gantt chart component for AngularJS

[angular-gantt](http://www.angular-gantt.com) provides a gantt chart component to your [AngularJS](https://angularjs.org/) application.

<br/> 

![Angular Gantt](docs/img/angular-gantt.png)

## Try now

Try angular-gantt now using the [Demo Application](http://www.angular-gantt.com/demo).

[Unstable Demo Application](http://rawgit.com/angular-gantt/angular-gantt/master/demo/dist/index.html) is also available.
It is build against [github master](https://github.com/angular-gantt/angular-gantt) branch, and allows to preview 
bleeding edge features, but may be very unstable.

You can even try the API using Plunker sandbox, with [XYYkD8tf5b2LQs5kL5nx](http://plnkr.co/XYYkD8tf5b2LQs5kL5nx) 
(latest release) and [cNqoyX](http://plnkr.co/cNqoyX) (master branch).

## Features
- Two-way data binding between model and view.
- Advanced calendar support to define holidays and working hours.
- Each task and row has its own properties and behavior.
- Rows and tasks can be sorted and filtered.
- Plugin architecture to add custom features and hooks.
- API to listen events and call methods from your controller.

## Docs

Docs are built using [MkDocs](http://www.mkdocs.org/) and available at
[angular-gantt website](http://www.angular-gantt.com) (stable) and [ReadTheDocs](http://angular-gantt.readthedocs.org/en/latest/)
(master).

## Bower

angular-gantt is available through [bower](http://bower.io/) and [npm](https://www.npmjs.org/package/angular-gantt).

    bower install angular-gantt
    npm install angular-gantt
    
or

    bower install angular-gantt#master
    npm install https://github.com/angular-gantt/angular-gantt/tarball/master
    
## CDNs

You can find released version on CDNs.

[jsDelivr](http://www.jsdelivr.com/)

    //cdn.jsdelivr.net/angular.gantt/latest/angular-gantt.min.js
    //cdn.jsdelivr.net/angular.gantt/latest/angular-gantt-plugins.min.css

[CDNjs](http://www.cdnjs.com/) (Replace `<version>` with latest github tag)

    //cdnjs.cloudflare.com/ajax/libs/angular-gantt/<version>/angular-gantt.min.js
    //cdnjs.cloudflare.com/ajax/libs/angular-gantt/<version>/angular-gantt-plugins.min.css

## Download

[Latest released version](https://github.com/angular-gantt/angular-gantt/releases/latest) is available to 
[download](https://github.com/angular-gantt/angular-gantt/releases/latest) on Github and is the recommended and stable version.

[Master branch version](https://github.com/angular-gantt/angular-gantt/tree/master) contains bleeding edge features, but may be very unstable.

## Dependencies
- [AngularJS](https://angularjs.org) >= 1.3
- [angular-moment](https://github.com/urish/angular-moment) ([momentJS](http://momentjs.com/) wrapper)

Note: Some plugins require additional dependencies.

## The MIT License

Copyright (c) 2015 Marco Schweighauser, Rémi Alvergnat

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
