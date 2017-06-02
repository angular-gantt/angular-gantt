// This file is adapted from Angular UI ngGrid project
// MIT License
// https://github.com/angular-ui/ng-grid/blob/v3.0.0-rc.20/src/js/core/factories/GridApi.js
import angular, {IQService, IRootScopeService} from 'angular';

import GanttUtilsService from '../util/utils.service';
import {Gantt} from '../gantt.factory';

/**
 * @ngdoc function
 * @name gantt.class:GanttApi
 * @description GanttApi provides the ability to register public methods events inside the gantt and allow
 * for other components to use the api via featureName.raise.methodName and featureName.on.eventName(function(args){}.
 * @param {object} gantt gantt that owns api
 */
export class GanttApi {
  static $q: IQService;
  static $rootScope: IRootScopeService;
  static ganttUtils: GanttUtilsService;

  private gantt: Gantt;
  private listeners: any[];
  private apiId: number;

  constructor(gantt) {
    this.gantt = gantt;
    this.listeners = [];
    this.apiId = GanttApi.ganttUtils.newId();
  }

  private registerEventWithAngular(eventId, handler, gantt, _this) {
    return GanttApi.$rootScope.$on(eventId, function () {
      let args = Array.prototype.slice.call(arguments);
      args.splice(0, 1); // remove evt argument
      handler.apply(_this ? _this : gantt.api, args);
    });
  }

  /**
   * @ngdoc function
   * @name gantt.class:suppressEvents
   * @methodOf gantt.class:GanttApi
   * @description Used to execute a function while disabling the specified event listeners.
   * Disables the listenerFunctions, executes the callbackFn, and then enables
   * the listenerFunctions again
   * @param {object} listenerFuncs listenerFunc or array of listenerFuncs to suppress. These must be the same
   * functions that were used in the .on.eventName method
   * @param {object} callBackFn function to execute
   * @example
   * <pre>
   *    let navigate = function (newRowCol, oldRowCol){
   *       //do something on navigate
   *    }
   *
   *    ganttApi.cellNav.on.navigate(scope,navigate);
   *
   *
   *    //call the scrollTo event and suppress our navigate listener
   *    //scrollTo will still raise the event for other listeners
   *    ganttApi.suppressEvents(navigate, function(){
   *       ganttApi.cellNav.scrollTo(aRow, aCol);
   *    });
   *
   * </pre>
   */
  suppressEvents(listenerFuncs, callBackFn) {
    let listeners = Array.isArray(listenerFuncs) ? listenerFuncs : [listenerFuncs];

    // find all registered listeners
    let foundListeners = [];
    listeners.forEach((l) => {
      foundListeners = this.listeners.filter((lstnr) => l === lstnr.handler);
    });

    // deregister all the listeners
    foundListeners.forEach((l) => l.dereg());

    callBackFn();

    // reregister all the listeners
    foundListeners.forEach((l) => {
      l.dereg = this.registerEventWithAngular(l.eventId, l.handler, this.gantt, l._this);
    });

  };

  /**
   * @ngdoc function
   * @name registerEvent
   * @methodOf gantt.class:GanttApi
   * @description Registers a new event for the given feature.  The event will get a
   * .raise and .on prepended to it
   * <br>
   * .raise.eventName() - takes no arguments
   * <br/>
   * <br/>
   * .on.eventName(scope, callBackFn, _this)
   * <br/>
   * scope - a scope reference to add a deregister call to the scopes .$on('destroy')
   * <br/>
   * callBackFn - The function to call
   * <br/>
   * _this - optional this context variable for callbackFn. If omitted, gantt.api will be used for the context
   * <br/>
   * .on.eventName returns a dereg funtion that will remove the listener.  It's not necessary to use it as the listener
   * will be removed when the scope is destroyed.
   * @param {string} featureName name of the feature that raises the event
   * @param {string} eventName  name of the event
   */
  registerEvent(featureName, eventName) {
    if (!this[featureName]) {
      this[featureName] = {};
    }

    let feature = this[featureName];
    if (!feature.on) {
      feature.on = {};
      feature.raise = {};
    }

    let eventId = 'event:gantt:' + this.apiId + ':' + featureName + ':' + eventName;

    // Creating raise event method featureName.raise.eventName
    feature.raise[eventName] = function () {
      GanttApi.$rootScope.$emit.apply(GanttApi.$rootScope, [eventId].concat(Array.prototype.slice.call(arguments)));
    };

    // Creating on event method featureName.oneventName
    feature.on[eventName] = (scope, handler, _this) => {
      let deregAngularOn = this.registerEventWithAngular(eventId, handler, this.gantt, _this);

      // track our listener so we can turn off and on
      let listener = {
        handler: handler,
        dereg: deregAngularOn,
        eventId: eventId,
        scope: scope,
        _this: _this
      };
      this.listeners.push(listener);

      let removeListener = () => {
        listener.dereg();
        let index = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
      };

      // destroy tracking when scope is destroyed
      scope.$on('$destroy', function () {
        removeListener();
      });

      return removeListener;
    };
  };

  /**
   * @ngdoc function
   * @name registerEventsFromObject
   * @methodOf gantt.class:GanttApi
   * @description Registers features and events from a simple objectMap.
   * eventObjectMap must be in this format (multiple features allowed)
   * <pre>
   * {featureName:
   *        {
   *          eventNameOne:function(args){},
   *          eventNameTwo:function(args){}
   *        }
   *  }
   * </pre>
   * @param {object} eventObjectMap map of feature/event names
   */
  registerEventsFromObject(eventObjectMap) {
    let features = [];
    angular.forEach(eventObjectMap, function (featProp, featPropName) {
      let feature = {name: featPropName, events: []};
      angular.forEach(featProp, function (prop, propName) {
        feature.events.push(propName);
      });
      features.push(feature);
    });

    features.forEach((feature) => {
      feature.events.forEach((event) => {
        this.registerEvent(feature.name, event);
      });
    });

  };

  /**
   * @ngdoc function
   * @name registerMethod
   * @methodOf gantt.class:GanttApi
   * @description Registers a new event for the given feature
   * @param {string} featureName name of the feature
   * @param {string} methodName  name of the method
   * @param {object} callBackFn function to execute
   * @param {object} _this binds callBackFn 'this' to _this.  Defaults to ganttApi.gantt
   */
  registerMethod(featureName, methodName, callBackFn, _this) {
    if (!this[featureName]) {
      this[featureName] = {};
    }

    let feature = this[featureName];

    feature[methodName] = GanttApi.ganttUtils.createBoundedWrapper(_this || this.gantt, callBackFn);
  };

  /**
   * @ngdoc function
   * @name registerMethodsFromObject
   * @methodOf gantt.class:GanttApi
   * @description Registers features and methods from a simple objectMap.
   * eventObjectMap must be in this format (multiple features allowed)
   * <br>
   * {featureName:
   *        {
   *          methodNameOne:function(args){},
   *          methodNameTwo:function(args){}
   *        }
   * @param {object} eventObjectMap map of feature/event names
   * @param {object} _this binds this to _this for all functions.  Defaults to ganttApi.gantt
   */
  registerMethodsFromObject(methodMap, _this) {
    let features = [];
    angular.forEach(methodMap, function (featProp, featPropName) {
      let feature = {name: featPropName, methods: []};
      angular.forEach(featProp, function (prop, propName) {
        feature.methods.push({name: propName, fn: prop});
      });
      features.push(feature);
    });

    features.forEach((feature) => {
      feature.methods.forEach((method) => {
        this.registerMethod(feature.name, method.name, method.fn, _this);
      });
    });

  };
}

export default function ($q: IQService, $rootScope: IRootScopeService, ganttUtils: GanttUtilsService) {
  'ngInject';

  GanttApi.$q = $q;
  GanttApi.$rootScope = $rootScope;
  GanttApi.ganttUtils = ganttUtils;
  return GanttApi;
}
