import gantt from '../src'
import angular from 'angular'

import ngAnimate from 'angular-animate'
import ngStrap from 'angular-strap'

import demoController from './demo.controller'
import demoService from './demo.service'

import plugins from '../src/plugins'

require('bootstrap/dist/css/bootstrap.css')
require('font-awesome/css/font-awesome.css')
require('./demo.css')

const demoModule = 'gantt.demo'
angular
  .module(demoModule, [gantt, ngStrap, ngAnimate, plugins.bounds, plugins.corner,
    plugins.dependencies, plugins.drawtask, plugins.groups, plugins.labels,
    plugins.movable, plugins.overlap, plugins.progress,
    plugins.resizeSensor, plugins.sections, plugins.sortable,
    plugins.table, plugins.tooltips, plugins.tree])
  .service('DemoService', demoService)
  .controller('DemoCtrl', demoController)
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false) // Remove debug info (angularJS >= 1.3)
  }])

export default demoModule
