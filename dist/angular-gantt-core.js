/*!
 * Project: angular-gantt v1.3.2 - Gantt chart component for AngularJS
 * Authors: Rémi Alvergnat <toilal.dev@gmail.com> (https://www.pragmasphere.com), Marco Schweighauser
 * License: MIT
 * Homepage: https://www.angular-gantt.com
 * Github: https://github.com/angular-gantt/angular-gantt.git
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define("angular-gantt-core", ["angular", "moment"], factory);
	else if(typeof exports === 'object')
		exports["angular-gantt-core"] = factory(require("angular"), require("moment"));
	else
		root["angular-gantt-core"] = factory(root["angular"], root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(118);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(117);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _gantt = __webpack_require__(41);

var _gantt2 = _interopRequireDefault(_gantt);

var _resizer = __webpack_require__(75);

var _resizer2 = _interopRequireDefault(_resizer);

var _containerHeightListener = __webpack_require__(81);

var _containerHeightListener2 = _interopRequireDefault(_containerHeightListener);

var _containerWidthListener = __webpack_require__(82);

var _containerWidthListener2 = _interopRequireDefault(_containerWidthListener);

var _elementHeightListener = __webpack_require__(83);

var _elementHeightListener2 = _interopRequireDefault(_elementHeightListener);

var _elementWidthListener = __webpack_require__(84);

var _elementWidthListener2 = _interopRequireDefault(_elementWidthListener);

var _horizontalScrollReceiver = __webpack_require__(76);

var _horizontalScrollReceiver2 = _interopRequireDefault(_horizontalScrollReceiver);

var _scrollable = __webpack_require__(79);

var _scrollable2 = _interopRequireDefault(_scrollable);

var _scrollManager = __webpack_require__(77);

var _scrollManager2 = _interopRequireDefault(_scrollManager);

var _scrollSender = __webpack_require__(78);

var _scrollSender2 = _interopRequireDefault(_scrollSender);

var _verticalScrollReceiver = __webpack_require__(80);

var _verticalScrollReceiver2 = _interopRequireDefault(_verticalScrollReceiver);

var _body = __webpack_require__(85);

var _body2 = _interopRequireDefault(_body);

var _bodyBackground = __webpack_require__(86);

var _bodyBackground2 = _interopRequireDefault(_bodyBackground);

var _bodyColumns = __webpack_require__(87);

var _bodyColumns2 = _interopRequireDefault(_bodyColumns);

var _bodyForeground = __webpack_require__(88);

var _bodyForeground2 = _interopRequireDefault(_bodyForeground);

var _bodyRows = __webpack_require__(89);

var _bodyRows2 = _interopRequireDefault(_bodyRows);

var _column = __webpack_require__(90);

var _column2 = _interopRequireDefault(_column);

var _columnHeader = __webpack_require__(91);

var _columnHeader2 = _interopRequireDefault(_columnHeader);

var _header = __webpack_require__(92);

var _header2 = _interopRequireDefault(_header);

var _headerColumns = __webpack_require__(93);

var _headerColumns2 = _interopRequireDefault(_headerColumns);

var _row = __webpack_require__(94);

var _row2 = _interopRequireDefault(_row);

var _rowBackground = __webpack_require__(95);

var _rowBackground2 = _interopRequireDefault(_rowBackground);

var _rowLabel = __webpack_require__(96);

var _rowLabel2 = _interopRequireDefault(_rowLabel);

var _scrollableHeader = __webpack_require__(97);

var _scrollableHeader2 = _interopRequireDefault(_scrollableHeader);

var _side = __webpack_require__(98);

var _side2 = _interopRequireDefault(_side);

var _sideBackground = __webpack_require__(99);

var _sideBackground2 = _interopRequireDefault(_sideBackground);

var _sideContent = __webpack_require__(100);

var _sideContent2 = _interopRequireDefault(_sideContent);

var _task = __webpack_require__(101);

var _task2 = _interopRequireDefault(_task);

var _taskBackground = __webpack_require__(102);

var _taskBackground2 = _interopRequireDefault(_taskBackground);

var _taskContent = __webpack_require__(103);

var _taskContent2 = _interopRequireDefault(_taskContent);

var _taskForeground = __webpack_require__(104);

var _taskForeground2 = _interopRequireDefault(_taskForeground);

var _timeFrame = __webpack_require__(105);

var _timeFrame2 = _interopRequireDefault(_timeFrame);

var _timespan = __webpack_require__(106);

var _timespan2 = _interopRequireDefault(_timespan);

var _ganttBindCompileHtml = __webpack_require__(111);

var _ganttBindCompileHtml2 = _interopRequireDefault(_ganttBindCompileHtml);

var _gantt3 = __webpack_require__(52);

var _gantt4 = _interopRequireDefault(_gantt3);

var _api = __webpack_require__(42);

var _api2 = _interopRequireDefault(_api);

var _options = __webpack_require__(43);

var _options2 = _interopRequireDefault(_options);

var _calendar = __webpack_require__(44);

var _calendar2 = _interopRequireDefault(_calendar);

var _scroll = __webpack_require__(65);

var _scroll2 = _interopRequireDefault(_scroll);

var _body3 = __webpack_require__(58);

var _body4 = _interopRequireDefault(_body3);

var _bodyColumns3 = __webpack_require__(60);

var _bodyColumns4 = _interopRequireDefault(_bodyColumns3);

var _bodyRows3 = __webpack_require__(62);

var _bodyRows4 = _interopRequireDefault(_bodyRows3);

var _bodyBackground3 = __webpack_require__(59);

var _bodyBackground4 = _interopRequireDefault(_bodyBackground3);

var _bodyForeground3 = __webpack_require__(61);

var _bodyForeground4 = _interopRequireDefault(_bodyForeground3);

var _rowHeader = __webpack_require__(55);

var _rowHeader2 = _interopRequireDefault(_rowHeader);

var _header3 = __webpack_require__(63);

var _header4 = _interopRequireDefault(_header3);

var _headerColumns3 = __webpack_require__(64);

var _headerColumns4 = _interopRequireDefault(_headerColumns3);

var _side3 = __webpack_require__(66);

var _side4 = _interopRequireDefault(_side3);

var _objectModel = __webpack_require__(53);

var _objectModel2 = _interopRequireDefault(_objectModel);

var _task3 = __webpack_require__(57);

var _task4 = _interopRequireDefault(_task3);

var _row3 = __webpack_require__(54);

var _row4 = _interopRequireDefault(_row3);

var _rowsManager = __webpack_require__(56);

var _rowsManager2 = _interopRequireDefault(_rowsManager);

var _column3 = __webpack_require__(46);

var _column4 = _interopRequireDefault(_column3);

var _columnHeader3 = __webpack_require__(49);

var _columnHeader4 = _interopRequireDefault(_columnHeader3);

var _columnBuilder = __webpack_require__(47);

var _columnBuilder2 = _interopRequireDefault(_columnBuilder);

var _columnsManager = __webpack_require__(50);

var _columnsManager2 = _interopRequireDefault(_columnsManager);

var _timespan3 = __webpack_require__(67);

var _timespan4 = _interopRequireDefault(_timespan3);

var _timespansManager = __webpack_require__(68);

var _timespansManager2 = _interopRequireDefault(_timespansManager);

var _currentDateManager = __webpack_require__(45);

var _currentDateManager2 = _interopRequireDefault(_currentDateManager);

var _hierarchy = __webpack_require__(71);

var _hierarchy2 = _interopRequireDefault(_hierarchy);

var _debounce = __webpack_require__(107);

var _debounce2 = _interopRequireDefault(_debounce);

var _smartEvent = __webpack_require__(115);

var _smartEvent2 = _interopRequireDefault(_smartEvent);

var _enableNgAnimate = __webpack_require__(110);

var _enableNgAnimate2 = _interopRequireDefault(_enableNgAnimate);

var _utils = __webpack_require__(72);

var _utils2 = _interopRequireDefault(_utils);

var _arrays = __webpack_require__(69);

var _arrays2 = _interopRequireDefault(_arrays);

var _directiveBuilder = __webpack_require__(108);

var _directiveBuilder2 = _interopRequireDefault(_directiveBuilder);

var _binarySearch = __webpack_require__(70);

var _binarySearch2 = _interopRequireDefault(_binarySearch);

var _layout = __webpack_require__(112);

var _layout2 = _interopRequireDefault(_layout);

var _headersGenerator = __webpack_require__(51);

var _headersGenerator2 = _interopRequireDefault(_headersGenerator);

var _columnGenerator = __webpack_require__(48);

var _columnGenerator2 = _interopRequireDefault(_columnGenerator);

var _dom = __webpack_require__(109);

var _dom2 = _interopRequireDefault(_dom);

var _mouseButton = __webpack_require__(113);

var _mouseButton2 = _interopRequireDefault(_mouseButton);

var _mouseOffset = __webpack_require__(114);

var _mouseOffset2 = _interopRequireDefault(_mouseOffset);

var _columnLimit = __webpack_require__(73);

var _columnLimit2 = _interopRequireDefault(_columnLimit);

var _taskLimit = __webpack_require__(74);

var _taskLimit2 = _interopRequireDefault(_taskLimit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(116);
__webpack_require__(40);

var _module = 'gantt';
_angular2.default.module(_module, []).directive('gantt', _gantt2.default).directive('ganttResizer', _resizer2.default).directive('ganttContainerWidthListener', _containerWidthListener2.default).directive('ganttContainerHeightListener', _containerHeightListener2.default).directive('ganttElementWidthListener', _elementWidthListener2.default).directive('ganttElementHeightListener', _elementHeightListener2.default).directive('ganttHorizontalScrollReceiver', _horizontalScrollReceiver2.default).directive('ganttScrollable', _scrollable2.default).directive('ganttScrollManager', _scrollManager2.default).directive('ganttScrollSender', _scrollSender2.default).directive('ganttVerticalScrollReceiver', _verticalScrollReceiver2.default).directive('ganttBindCompileHtml', _ganttBindCompileHtml2.default).directive('ganttBody', _body2.default).directive('ganttBodyBackground', _bodyBackground2.default).directive('ganttBodyColumns', _bodyColumns2.default).directive('ganttBodyForeground', _bodyForeground2.default).directive('ganttBodyRows', _bodyRows2.default).directive('ganttColumn', _column2.default).directive('ganttColumnHeader', _columnHeader2.default).directive('ganttHeader', _header2.default).directive('ganttHeaderColumns', _headerColumns2.default).directive('ganttRow', _row2.default).directive('ganttRowBackground', _rowBackground2.default).directive('ganttRowLabel', _rowLabel2.default).directive('ganttScrollableHeader', _scrollableHeader2.default).directive('ganttSide', _side2.default).directive('ganttSideBackground', _sideBackground2.default).directive('ganttSideContent', _sideContent2.default).directive('ganttTask', _task2.default).directive('ganttTaskBackground', _taskBackground2.default).directive('ganttTaskContent', _taskContent2.default).directive('ganttTaskForeground', _taskForeground2.default).directive('ganttTimeFrame', _timeFrame2.default).directive('ganttTimespan', _timespan2.default).factory('Gantt', _gantt4.default).factory('GanttApi', _api2.default).factory('GanttOptions', _options2.default).factory('GanttCalendar', _calendar2.default).factory('GanttScroll', _scroll2.default).factory('GanttBody', _body4.default).factory('GanttBodyColumns', _bodyColumns4.default).factory('GanttBodyRows', _bodyRows4.default).factory('GanttBodyBackground', _bodyBackground4.default).factory('GanttBodyForeground', _bodyForeground4.default).factory('GanttRowHeader', _rowHeader2.default).factory('GanttHeader', _header4.default).factory('GanttHeaderColumns', _headerColumns4.default).factory('GanttSide', _side4.default).factory('GanttObjectModel', _objectModel2.default).factory('GanttTask', _task4.default).factory('GanttRow', _row4.default).factory('GanttRowsManager', _rowsManager2.default).factory('GanttColumn', _column4.default).factory('GanttColumnHeader', _columnHeader4.default).factory('GanttColumnBuilder', _columnBuilder2.default).factory('GanttColumnsManager', _columnsManager2.default).factory('GanttTimespan', _timespan4.default).factory('GanttTimespansManager', _timespansManager2.default).factory('GanttCurrentDateManager', _currentDateManager2.default).factory('GanttHierarchy', _hierarchy2.default).factory('ganttDebounce', _debounce2.default).factory('ganttSmartEvent', _smartEvent2.default).service('ganttEnableNgAnimate', _enableNgAnimate2.default).service('ganttUtils', _utils2.default).service('ganttArrays', _arrays2.default).service('GanttDirectiveBuilder', _directiveBuilder2.default).service('ganttBinarySearch', _binarySearch2.default).service('ganttLayout', _layout2.default).service('GanttHeadersGenerator', _headersGenerator2.default).service('GanttColumnGenerator', _columnGenerator2.default).service('ganttDom', _dom2.default).service('ganttMouseButton', _mouseButton2.default).service('ganttMouseOffset', _mouseOffset2.default).filter('ganttColumnLimit', _columnLimit2.default).filter('ganttTaskLimit', _taskLimit2.default);
exports.default = _module;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(127)
  , defined = __webpack_require__(18);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(12)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(9)
  , createDesc = __webpack_require__(15);
module.exports = __webpack_require__(7) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(11)
  , IE8_DOM_DEFINE = __webpack_require__(33)
  , toPrimitive    = __webpack_require__(27)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(7) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(25)('wks')
  , uid        = __webpack_require__(16)
  , Symbol     = __webpack_require__(4).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(38)
  , enumBugKeys = __webpack_require__(19);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(9).f
  , has = __webpack_require__(5)
  , TAG = __webpack_require__(10)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(25)('keys')
  , uid    = __webpack_require__(16);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(13);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(4)
  , core           = __webpack_require__(17)
  , LIBRARY        = __webpack_require__(21)
  , wksExt         = __webpack_require__(29)
  , defineProperty = __webpack_require__(9).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(10);

/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13)
  , document = __webpack_require__(4).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(4)
  , core      = __webpack_require__(17)
  , ctx       = __webpack_require__(124)
  , hide      = __webpack_require__(8)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(7) && !__webpack_require__(12)(function(){
  return Object.defineProperty(__webpack_require__(31)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(21)
  , $export        = __webpack_require__(32)
  , redefine       = __webpack_require__(39)
  , hide           = __webpack_require__(8)
  , has            = __webpack_require__(5)
  , Iterators      = __webpack_require__(20)
  , $iterCreate    = __webpack_require__(129)
  , setToStringTag = __webpack_require__(23)
  , getPrototypeOf = __webpack_require__(136)
  , ITERATOR       = __webpack_require__(10)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(11)
  , dPs         = __webpack_require__(133)
  , enumBugKeys = __webpack_require__(19)
  , IE_PROTO    = __webpack_require__(24)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(31)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(126).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(38)
  , hiddenKeys = __webpack_require__(19).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(5)
  , toIObject    = __webpack_require__(6)
  , arrayIndexOf = __webpack_require__(123)(false)
  , IE_PROTO     = __webpack_require__(24)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);

/***/ }),
/* 40 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["Gantt", "ganttEnableNgAnimate", "$timeout", "$templateCache", function (Gantt, ganttEnableNgAnimate, $timeout, $templateCache) {
    'ngInject';

    return {
        restrict: 'A',
        transclude: true,
        templateUrl: function templateUrl(tElement, tAttrs) {
            var templateUrl = void 0;
            if (tAttrs.templateUrl === undefined) {
                templateUrl = 'template/gantt.tmpl.html';
            } else {
                templateUrl = tAttrs.templateUrl;
            }
            if (tAttrs.template !== undefined) {
                $templateCache.put(templateUrl, tAttrs.template);
            }
            return templateUrl;
        },
        scope: {
            sortMode: '=?',
            filterTask: '=?',
            filterTaskComparator: '=?',
            filterRow: '=?',
            filterRowComparator: '=?',
            viewScale: '=?',
            columnWidth: '=?',
            expandToFit: '=?',
            shrinkToFit: '=?',
            showSide: '=?',
            allowSideResizing: '=?',
            fromDate: '=?',
            toDate: '=?',
            currentDateValue: '=?',
            currentDate: '=?',
            daily: '=?',
            autoExpand: '=?',
            taskOutOfRange: '=?',
            taskContent: '=?',
            rowContent: '=?',
            maxHeight: '=?',
            sideWidth: '=?',
            headers: '=?',
            headersFormats: '=?',
            headersScales: '=?',
            timeFrames: '=?',
            dateFrames: '=?',
            timeFramesWorkingMode: '=?',
            timeFramesNonWorkingMode: '=?',
            timespans: '=?',
            columnMagnet: '=?',
            shiftColumnMagnet: '=?',
            timeFramesMagnet: '=?',
            data: '=?',
            api: '=?',
            options: '=?'
        },
        controller: ['$scope', '$element', function ($scope, $element) {
            for (var option in $scope.options) {
                $scope[option] = $scope.options[option];
            }

            ganttEnableNgAnimate($element, false);
            $scope.gantt = new Gantt($scope, $element);
            this.gantt = $scope.gantt;
        }],
        link: function link(scope, element) {
            scope.gantt.api.directives.raise.new('gantt', scope, element);
            scope.$on('$destroy', function () {
                scope.gantt.api.directives.raise.destroy('gantt', scope, element);
            });
            $timeout(function () {
                scope.gantt.initialized();
            });
        }
    };
}];

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$q", "$rootScope", "ganttUtils", function ($q, $rootScope, ganttUtils) {
    'ngInject';

    var GanttApi = function GanttApi(gantt) {
        this.gantt = gantt;
        this.listeners = [];
        this.apiId = ganttUtils.newId();
    };
    function registerEventWithAngular(eventId, handler, gantt, _this) {
        return $rootScope.$on(eventId, function () {
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1);
            handler.apply(_this ? _this : gantt.api, args);
        });
    }

    GanttApi.prototype.suppressEvents = function (listenerFuncs, callBackFn) {
        var self = this;
        var listeners = _angular2.default.isArray(listenerFuncs) ? listenerFuncs : [listenerFuncs];

        var foundListeners = [];
        listeners.forEach(function (l) {
            foundListeners = self.listeners.filter(function (lstnr) {
                return l === lstnr.handler;
            });
        });

        foundListeners.forEach(function (l) {
            l.dereg();
        });
        callBackFn();

        foundListeners.forEach(function (l) {
            l.dereg = registerEventWithAngular(l.eventId, l.handler, self.gantt, l._this);
        });
    };

    GanttApi.prototype.registerEvent = function (featureName, eventName) {
        var self = this;
        if (!self[featureName]) {
            self[featureName] = {};
        }
        var feature = self[featureName];
        if (!feature.on) {
            feature.on = {};
            feature.raise = {};
        }
        var eventId = 'event:gantt:' + this.apiId + ':' + featureName + ':' + eventName;

        feature.raise[eventName] = function () {
            $rootScope.$emit.apply($rootScope, [eventId].concat(Array.prototype.slice.call(arguments)));
        };

        feature.on[eventName] = function (scope, handler, _this) {
            var deregAngularOn = registerEventWithAngular(eventId, handler, self.gantt, _this);

            var listener = {
                handler: handler,
                dereg: deregAngularOn,
                eventId: eventId,
                scope: scope,
                _this: _this
            };
            self.listeners.push(listener);
            var removeListener = function removeListener() {
                listener.dereg();
                var index = self.listeners.indexOf(listener);
                self.listeners.splice(index, 1);
            };

            scope.$on('$destroy', function () {
                removeListener();
            });
            return removeListener;
        };
    };

    GanttApi.prototype.registerEventsFromObject = function (eventObjectMap) {
        var self = this;
        var features = [];
        _angular2.default.forEach(eventObjectMap, function (featProp, featPropName) {
            var feature = { name: featPropName, events: [] };
            _angular2.default.forEach(featProp, function (prop, propName) {
                feature.events.push(propName);
            });
            features.push(feature);
        });
        features.forEach(function (feature) {
            feature.events.forEach(function (event) {
                self.registerEvent(feature.name, event);
            });
        });
    };

    GanttApi.prototype.registerMethod = function (featureName, methodName, callBackFn, _this) {
        if (!this[featureName]) {
            this[featureName] = {};
        }
        var feature = this[featureName];
        feature[methodName] = ganttUtils.createBoundedWrapper(_this || this.gantt, callBackFn);
    };

    GanttApi.prototype.registerMethodsFromObject = function (methodMap, _this) {
        var self = this;
        var features = [];
        _angular2.default.forEach(methodMap, function (featProp, featPropName) {
            var feature = { name: featPropName, methods: [] };
            _angular2.default.forEach(featProp, function (prop, propName) {
                feature.methods.push({ name: propName, fn: prop });
            });
            features.push(feature);
        });
        features.forEach(function (feature) {
            feature.methods.forEach(function (method) {
                self.registerMethod(feature.name, method.name, method.fn, _this);
            });
        });
    };
    return GanttApi;
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var GanttOptions = function GanttOptions(values, defaultValues) {
        this.defaultValues = defaultValues;
        this.values = values;
        this.defaultValue = function (optionName) {
            var defaultValue = this.defaultValues[optionName];
            if (_angular2.default.isFunction(defaultValue)) {
                defaultValue = defaultValue();
            }
            return defaultValue;
        };
        this.sanitize = function (optionName, optionValue) {
            if (!optionValue) {
                var defaultValue = this.defaultValue(optionName);
                if (defaultValue !== undefined) {
                    if (optionValue !== undefined && typeof defaultValue === 'boolean') {
                        return optionValue;
                    }
                    return defaultValue;
                }
            }
            return optionValue;
        };
        this.value = function (optionName) {
            return this.sanitize(optionName, this.values[optionName]);
        };
        this.set = function (optionName, optionValue) {
            this.values[optionName] = optionValue;
        };
        this.initialize = function () {
            for (var optionName in this.values) {
                var optionValue = this.values[optionName];
                if (this.values.hasOwnProperty(optionName)) {
                    this.values[optionName] = this.value(optionName, optionValue);
                }
            }
            return this.values;
        };
    };
    return GanttOptions;
};

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$filter", function ($filter) {
    'ngInject';

    var TimeFrame = function TimeFrame(options) {
        if (options === undefined) {
            options = {};
        }
        this.start = options.start;
        this.end = options.end;
        this.working = options.working;
        this.magnet = options.magnet !== undefined ? options.magnet : true;
        this.default = options.default;
        this.color = options.color;
        this.classes = options.classes;
        this.internal = options.internal;
    };
    TimeFrame.prototype.updateView = function () {
        if (this.$element) {
            var cssStyles = {};
            if (this.left !== undefined) {
                cssStyles['left'] = this.left + 'px';
            } else {
                cssStyles['left'] = '';
            }
            if (this.width !== undefined) {
                cssStyles['width'] = this.width + 'px';
            } else {
                cssStyles['width'] = '';
            }
            if (this.color !== undefined) {
                cssStyles['background-color'] = this.color;
            } else {
                cssStyles['background-color'] = '';
            }
            this.$element.css(cssStyles);
            var classes = ['gantt-timeframe' + (this.working ? '' : '-non') + '-working'];
            if (this.classes) {
                classes = classes.concat(this.classes);
            }

            for (var i = 0, l = classes.length; i < l; i++) {
                this.$element.toggleClass(classes[i], true);
            }
        }
    };
    TimeFrame.prototype.getDuration = function () {
        if (this.end !== undefined && this.start !== undefined) {
            return this.end.diff(this.start, 'milliseconds');
        }
    };
    TimeFrame.prototype.clone = function () {
        return new TimeFrame(this);
    };

    var TimeFrameMapping = function TimeFrameMapping(func) {
        this.func = func;
    };
    TimeFrameMapping.prototype.getTimeFrames = function (date) {
        var ret = this.func(date);
        if (!(ret instanceof Array)) {
            ret = [ret];
        }
        return ret;
    };
    TimeFrameMapping.prototype.clone = function () {
        return new TimeFrameMapping(this.func);
    };

    var DateFrame = function DateFrame(options) {
        this.evaluator = options.evaluator;
        if (options.date) {
            this.start = (0, _moment2.default)(options.date).startOf('day');
            this.end = (0, _moment2.default)(options.date).endOf('day');
        } else {
            this.start = options.start;
            this.end = options.end;
        }
        if (options.targets instanceof Array) {
            this.targets = options.targets;
        } else {
            this.targets = [options.targets];
        }
        this.default = options.default;
    };
    DateFrame.prototype.dateMatch = function (date) {
        if (this.evaluator) {
            return this.evaluator(date);
        } else if (this.start && this.end) {
            return date >= this.start && date <= this.end;
        } else {
            return false;
        }
    };
    DateFrame.prototype.clone = function () {
        return new DateFrame(this);
    };

    var Calendar = function Calendar() {
        this.timeFrames = {};
        this.timeFrameMappings = {};
        this.dateFrames = {};
    };

    Calendar.prototype.clear = function () {
        this.timeFrames = {};
        this.timeFrameMappings = {};
        this.dateFrames = {};
    };

    Calendar.prototype.registerTimeFrames = function (timeFrames) {
        _angular2.default.forEach(timeFrames, function (timeFrame, name) {
            this.timeFrames[name] = new TimeFrame(timeFrame);
        }, this);
    };

    Calendar.prototype.removeTimeFrames = function (timeFrames) {
        _angular2.default.forEach(timeFrames, function (name) {
            delete this.timeFrames[name];
        }, this);
    };

    Calendar.prototype.clearTimeFrames = function () {
        this.timeFrames = {};
    };

    Calendar.prototype.registerTimeFrameMappings = function (mappings) {
        _angular2.default.forEach(mappings, function (timeFrameMapping, name) {
            this.timeFrameMappings[name] = new TimeFrameMapping(timeFrameMapping);
        }, this);
    };

    Calendar.prototype.removeTimeFrameMappings = function (mappings) {
        _angular2.default.forEach(mappings, function (name) {
            delete this.timeFrameMappings[name];
        }, this);
    };

    Calendar.prototype.clearTimeFrameMappings = function () {
        this.timeFrameMappings = {};
    };

    Calendar.prototype.registerDateFrames = function (dateFrames) {
        _angular2.default.forEach(dateFrames, function (dateFrame, name) {
            this.dateFrames[name] = new DateFrame(dateFrame);
        }, this);
    };

    Calendar.prototype.removeDateFrames = function (dateFrames) {
        _angular2.default.forEach(dateFrames, function (name) {
            delete this.dateFrames[name];
        }, this);
    };

    Calendar.prototype.clearDateFrames = function () {
        this.dateFrames = {};
    };
    var filterDateFrames = function filterDateFrames(inputDateFrames, date) {
        var dateFrames = [];
        _angular2.default.forEach(inputDateFrames, function (dateFrame) {
            if (dateFrame.dateMatch(date)) {
                dateFrames.push(dateFrame);
            }
        });
        if (dateFrames.length === 0) {
            _angular2.default.forEach(inputDateFrames, function (dateFrame) {
                if (dateFrame.default) {
                    dateFrames.push(dateFrame);
                }
            });
        }
        return dateFrames;
    };

    Calendar.prototype.getTimeFrames = function (date) {
        var timeFrames = [];
        var dateFrames = filterDateFrames(this.dateFrames, date);
        for (var i = 0; i < dateFrames.length; i++) {
            if (dateFrames[i] !== undefined) {
                var targets = dateFrames[i].targets;
                for (var j = 0; j < targets.length; j++) {
                    var timeFrameMapping = this.timeFrameMappings[targets[j]];
                    if (timeFrameMapping !== undefined) {
                        timeFrames.push(timeFrameMapping.getTimeFrames());
                    } else {
                        var timeFrame = this.timeFrames[targets[j]];
                        if (timeFrame !== undefined) {
                            timeFrames.push(timeFrame);
                        }
                    }
                }
            }
        }
        var dateYear = date.year();
        var dateMonth = date.month();
        var dateDate = date.date();
        var validatedTimeFrames = [];
        if (timeFrames.length === 0) {
            _angular2.default.forEach(this.timeFrames, function (timeFrame) {
                if (timeFrame.default) {
                    timeFrames.push(timeFrame);
                }
            });
        }
        for (var _i = 0; _i < timeFrames.length; _i++) {
            var cTimeFrame = timeFrames[_i].clone();
            if (cTimeFrame.start !== undefined) {
                cTimeFrame.start.year(dateYear);
                cTimeFrame.start.month(dateMonth);
                cTimeFrame.start.date(dateDate);
            }
            if (cTimeFrame.end !== undefined) {
                cTimeFrame.end.year(dateYear);
                cTimeFrame.end.month(dateMonth);
                cTimeFrame.end.date(dateDate);
                if ((0, _moment2.default)(cTimeFrame.end).startOf('day') === cTimeFrame.end) {
                    cTimeFrame.end.add(1, 'day');
                }
            }
            validatedTimeFrames.push(cTimeFrame);
        }
        return validatedTimeFrames;
    };

    Calendar.prototype.solve = function (timeFrames, startDate, endDate) {
        var color = void 0;
        var classes = void 0;
        var minDate = void 0;
        var maxDate = void 0;
        for (var i = 0; i < timeFrames.length; i++) {
            var timeFrame = timeFrames[i];
            if (minDate === undefined || minDate > timeFrame.start) {
                minDate = timeFrame.start;
            }
            if (maxDate === undefined || maxDate < timeFrame.end) {
                maxDate = timeFrame.end;
            }
            if (color === undefined && timeFrame.color) {
                color = timeFrame.color;
            }
            if (timeFrame.classes !== undefined) {
                if (classes === undefined) {
                    classes = [];
                }
                classes = classes.concat(timeFrame.classes);
            }
        }
        if (startDate === undefined) {
            startDate = minDate;
        }
        if (endDate === undefined) {
            endDate = maxDate;
        }
        var solvedTimeFrames = [new TimeFrame({ start: startDate, end: endDate, internal: true })];
        timeFrames = $filter('filter')(timeFrames, function (timeFrame) {
            return (timeFrame.start === undefined || timeFrame.start < endDate) && (timeFrame.end === undefined || timeFrame.end > startDate);
        });
        for (var _i2 = 0; _i2 < timeFrames.length; _i2++) {
            var cTimeFrame = timeFrames[_i2];
            if (!cTimeFrame.start) {
                cTimeFrame.start = startDate;
            }
            if (!cTimeFrame.end) {
                cTimeFrame.end = endDate;
            }
        }
        var orderedTimeFrames = $filter('orderBy')(timeFrames, function (timeFrame) {
            return -timeFrame.getDuration();
        });
        var k = void 0;
        for (var _i3 = 0; _i3 < orderedTimeFrames.length; _i3++) {
            var oTimeFrame = orderedTimeFrames[_i3];
            var tmpSolvedTimeFrames = solvedTimeFrames.slice();
            k = 0;
            var dispatched = false;
            var treated = false;
            for (var j = 0; j < solvedTimeFrames.length; j++) {
                var sTimeFrame = solvedTimeFrames[j];
                if (!treated) {
                    if (!oTimeFrame.end && !oTimeFrame.start) {
                        tmpSolvedTimeFrames.splice(k, 0, oTimeFrame);
                        treated = true;
                        dispatched = false;
                    } else if (oTimeFrame.end > sTimeFrame.start && oTimeFrame.start < sTimeFrame.end) {
                        var newSolvedTimeFrame = sTimeFrame.clone();
                        sTimeFrame.end = (0, _moment2.default)(oTimeFrame.start);
                        newSolvedTimeFrame.start = (0, _moment2.default)(oTimeFrame.end);
                        tmpSolvedTimeFrames.splice(k + 1, 0, oTimeFrame.clone(), newSolvedTimeFrame);
                        treated = true;
                        dispatched = false;
                    } else if (!dispatched && oTimeFrame.start < sTimeFrame.end) {
                        sTimeFrame.end = (0, _moment2.default)(oTimeFrame.start);
                        tmpSolvedTimeFrames.splice(k + 1, 0, oTimeFrame.clone());
                        dispatched = true;
                    } else if (dispatched && oTimeFrame.end > sTimeFrame.start) {
                        sTimeFrame.start = (0, _moment2.default)(oTimeFrame.end);
                        dispatched = false;
                        treated = true;
                    }
                    k++;
                }
            }
            solvedTimeFrames = tmpSolvedTimeFrames;
        }
        solvedTimeFrames = $filter('filter')(solvedTimeFrames, function (timeFrame) {
            return !timeFrame.internal && (timeFrame.start === undefined || timeFrame.start < endDate) && (timeFrame.end === undefined || timeFrame.end > startDate);
        });
        return solvedTimeFrames;
    };
    return Calendar;
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var GanttCurrentDateManager = function GanttCurrentDateManager(gantt) {
        var self = this;
        this.gantt = gantt;
        this.date = undefined;
        this.position = undefined;
        this.currentDateColumn = undefined;
        this.gantt.$scope.simplifyMoment = function (d) {
            return _moment2.default.isMoment(d) ? d.unix() : d;
        };
        this.gantt.$scope.$watchGroup(['currentDate', 'simplifyMoment(currentDateValue)'], function (newValues, oldValues) {
            if (newValues !== oldValues) {
                self.setCurrentDate(self.gantt.options.value('currentDateValue'));
            }
        });
    };
    GanttCurrentDateManager.prototype.setCurrentDate = function (currentDate) {
        this.date = currentDate;
        var oldColumn = this.currentDateColumn;
        var newColumn = void 0;
        if (this.date !== undefined && this.gantt.options.value('currentDate') === 'column') {
            newColumn = this.gantt.columnsManager.getColumnByDate(this.date, true);
        }
        this.currentDateColumn = newColumn;
        if (oldColumn !== newColumn) {
            if (oldColumn !== undefined) {
                oldColumn.currentDate = false;
                oldColumn.updateView();
            }
            if (newColumn !== undefined) {
                newColumn.currentDate = true;
                newColumn.updateView();
            }
        }
        this.position = this.gantt.getPositionByDate(this.date, true);
    };
    return GanttCurrentDateManager;
};

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var Column = function Column(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode) {
        this.date = date;
        this.endDate = endDate;
        this.left = left;
        this.width = width;
        this.calendar = calendar;
        this.duration = this.endDate.diff(this.date, 'milliseconds');
        this.timeFramesWorkingMode = timeFramesWorkingMode;
        this.timeFramesNonWorkingMode = timeFramesNonWorkingMode;
        this.timeFrames = [];
        this.currentDate = false;
        this.visibleTimeFrames = [];
        this.daysTimeFrames = {};
        this.cropped = false;
        this.originalSize = { left: this.left, width: this.width };
        this.updateTimeFrames();
    };
    var getDateKey = function getDateKey(date) {
        return date.year() + '-' + date.month() + '-' + date.date();
    };
    Column.prototype.updateView = function () {
        if (this.$element) {
            if (this.currentDate) {
                this.$element.addClass('gantt-foreground-col-current-date');
            } else {
                this.$element.removeClass('gantt-foreground-col-current-date');
            }
            this.$element.css({ 'left': this.left + 'px', 'width': this.width + 'px' });

            for (var i = 0, l = this.timeFrames.length; i < l; i++) {
                this.timeFrames[i].updateView();
            }
        }
    };
    Column.prototype.updateTimeFrames = function () {
        var self = this;
        if (self.calendar !== undefined && (self.timeFramesNonWorkingMode !== 'hidden' || self.timeFramesWorkingMode !== 'hidden')) {
            var cDate = self.date;
            var cDateStartOfDay = (0, _moment2.default)(cDate).startOf('day');
            var cDateNextDay = cDateStartOfDay.add(1, 'day');
            var i = void 0;
            while (cDate < self.endDate) {
                var timeFrames = self.calendar.getTimeFrames(cDate);
                var nextCDate = _moment2.default.min(cDateNextDay, self.endDate);
                timeFrames = self.calendar.solve(timeFrames, cDate, nextCDate);
                var cTimeFrames = [];
                for (i = 0; i < timeFrames.length; i++) {
                    var cTimeFrame = timeFrames[i];
                    var start = cTimeFrame.start;
                    if (start === undefined) {
                        start = cDate;
                    }
                    var end = cTimeFrame.end;
                    if (end === undefined) {
                        end = nextCDate;
                    }
                    if (start < self.date) {
                        start = self.date;
                    }
                    if (end > self.endDate) {
                        end = self.endDate;
                    }
                    cTimeFrame = cTimeFrame.clone();
                    cTimeFrame.start = (0, _moment2.default)(start);
                    cTimeFrame.end = (0, _moment2.default)(end);
                    cTimeFrames.push(cTimeFrame);
                }
                self.timeFrames = self.timeFrames.concat(cTimeFrames);
                var cDateKey = getDateKey(cDate);
                self.daysTimeFrames[cDateKey] = cTimeFrames;
                cDate = nextCDate;
                cDateStartOfDay = (0, _moment2.default)(cDate).startOf('day');
                cDateNextDay = cDateStartOfDay.add(1, 'day');
            }
            for (i = 0; i < self.timeFrames.length; i++) {
                var timeFrame = self.timeFrames[i];
                var positionDuration = timeFrame.start.diff(self.date, 'milliseconds');
                var position = positionDuration / self.duration * self.width;
                var timeFrameDuration = timeFrame.end.diff(timeFrame.start, 'milliseconds');
                var timeFramePosition = timeFrameDuration / self.duration * self.width;
                var hidden = false;
                if (timeFrame.working && self.timeFramesWorkingMode !== 'visible') {
                    hidden = true;
                } else if (!timeFrame.working && self.timeFramesNonWorkingMode !== 'visible') {
                    hidden = true;
                }
                if (!hidden) {
                    self.visibleTimeFrames.push(timeFrame);
                }
                timeFrame.hidden = hidden;
                timeFrame.left = position;
                timeFrame.width = timeFramePosition;
                timeFrame.originalSize = { left: timeFrame.left, width: timeFrame.width };
            }
            if (self.timeFramesNonWorkingMode === 'cropped' || self.timeFramesWorkingMode === 'cropped') {
                var timeFramesWidth = 0;
                for (var j = 0; j < self.timeFrames.length; j++) {
                    var aTimeFrame = self.timeFrames[j];
                    if (!aTimeFrame.working && self.timeFramesNonWorkingMode !== 'cropped' || aTimeFrame.working && self.timeFramesWorkingMode !== 'cropped') {
                        timeFramesWidth += aTimeFrame.width;
                    }
                }
                if (timeFramesWidth !== self.width) {
                    var croppedRatio = self.width / timeFramesWidth;
                    var croppedWidth = 0;
                    var originalCroppedWidth = 0;
                    var allCropped = true;
                    for (var _j = 0; _j < self.timeFrames.length; _j++) {
                        var bTimeFrame = self.timeFrames[_j];
                        if (!bTimeFrame.working && self.timeFramesNonWorkingMode !== 'cropped' || bTimeFrame.working && self.timeFramesWorkingMode !== 'cropped') {
                            bTimeFrame.left = (bTimeFrame.left - croppedWidth) * croppedRatio;
                            bTimeFrame.width = bTimeFrame.width * croppedRatio;
                            bTimeFrame.originalSize.left = (bTimeFrame.originalSize.left - originalCroppedWidth) * croppedRatio;
                            bTimeFrame.originalSize.width = bTimeFrame.originalSize.width * croppedRatio;
                            bTimeFrame.cropped = false;
                            allCropped = false;
                        } else {
                            croppedWidth += bTimeFrame.width;
                            originalCroppedWidth += bTimeFrame.originalSize.width;
                            bTimeFrame.left = undefined;
                            bTimeFrame.width = 0;
                            bTimeFrame.originalSize = { left: undefined, width: 0 };
                            bTimeFrame.cropped = true;
                        }
                    }
                    self.cropped = allCropped;
                } else {
                    self.cropped = false;
                }
            }
        }
    };
    Column.prototype.clone = function () {
        return new Column((0, _moment2.default)(this.date), (0, _moment2.default)(this.endDate), this.left, this.width, this.calendar);
    };
    Column.prototype.containsDate = function (date) {
        return date > this.date && date <= this.endDate;
    };
    Column.prototype.equals = function (other) {
        return this.date === other.date;
    };
    Column.prototype.roundTo = function (date, unit, offset, midpoint) {
        if (unit === 'day') {
            unit = 'date';
        }
        offset = offset || 1;
        var value = date.get(unit);
        switch (midpoint) {
            case 'up':
                value = Math.ceil(value / offset);
                break;
            case 'down':
                value = Math.floor(value / offset);
                break;
            default:
                value = Math.round(value / offset);
                break;
        }
        var units = ['millisecond', 'second', 'minute', 'hour', 'date', 'month', 'year'];
        date.set(unit, value * offset);
        var indexOf = units.indexOf(unit);
        for (var i = 0; i < indexOf; i++) {
            date.set(units[i], 0);
        }
        return date;
    };
    Column.prototype.getMagnetDate = function (date, magnetValue, magnetUnit, timeFramesMagnet) {
        if (magnetValue > 0 && magnetUnit !== undefined) {
            var initialDate = date;
            date = (0, _moment2.default)(date);
            if (magnetUnit === 'column') {
                var position = this.getPositionByDate(date);
                if (position < this.width / 2) {
                    date = (0, _moment2.default)(this.date);
                } else {
                    date = (0, _moment2.default)(this.endDate);
                }
            } else {
                date = this.roundTo(date, magnetUnit, magnetValue);

                if (date < this.date) {
                    date = (0, _moment2.default)(this.date);
                } else if (date > this.endDate) {
                    date = (0, _moment2.default)(this.endDate);
                }
            }
            if (timeFramesMagnet) {
                var maxTimeFrameDiff = Math.abs(initialDate.diff(date, 'milliseconds'));
                var currentTimeFrameDiff = void 0;
                for (var i = 0; i < this.timeFrames.length; i++) {
                    var timeFrame = this.timeFrames[i];
                    if (timeFrame.magnet) {
                        var previousTimeFrame = this.timeFrames[i - 1];
                        var nextTimeFrame = this.timeFrames[i + 1];
                        var timeFrameDiff = void 0;
                        if (previousTimeFrame === undefined || previousTimeFrame.working !== timeFrame.working) {
                            timeFrameDiff = Math.abs(initialDate.diff(timeFrame.start, 'milliseconds'));
                            if (timeFrameDiff < maxTimeFrameDiff && (currentTimeFrameDiff === undefined || timeFrameDiff < currentTimeFrameDiff)) {
                                currentTimeFrameDiff = timeFrameDiff;
                                date = timeFrame.start;
                            }
                        }
                        if (nextTimeFrame === undefined || nextTimeFrame.working !== timeFrame.working) {
                            timeFrameDiff = Math.abs(initialDate.diff(timeFrame.end, 'milliseconds'));
                            if (timeFrameDiff < maxTimeFrameDiff && (currentTimeFrameDiff === undefined || timeFrameDiff < currentTimeFrameDiff)) {
                                currentTimeFrameDiff = timeFrameDiff;
                                date = timeFrame.end;
                            }
                        }
                    }
                }
            }
        }
        return date;
    };
    Column.prototype.getDateByPositionUsingTimeFrames = function (position) {
        for (var i = 0, l = this.timeFrames.length; i < l; i++) {
            var timeFrame = this.timeFrames[i];
            if (!timeFrame.cropped && position >= timeFrame.left && position <= timeFrame.left + timeFrame.width) {
                var positionDuration = timeFrame.getDuration() / timeFrame.width * (position - timeFrame.left);
                var date = (0, _moment2.default)(timeFrame.start).add(positionDuration, 'milliseconds');
                return date;
            }
        }
    };
    Column.prototype.getDateByPosition = function (position, magnetValue, magnetUnit, timeFramesMagnet) {
        var positionDuration = void 0;
        var date = void 0;
        if (position < 0) {
            position = 0;
        }
        if (position > this.width) {
            position = this.width;
        }
        if (this.timeFramesNonWorkingMode === 'cropped' || this.timeFramesWorkingMode === 'cropped') {
            date = this.getDateByPositionUsingTimeFrames(position);
        }
        if (date === undefined) {
            positionDuration = this.duration / this.width * position;
            date = (0, _moment2.default)(this.date).add(positionDuration, 'milliseconds');
        }
        date = this.getMagnetDate(date, magnetValue, magnetUnit, timeFramesMagnet);
        return date;
    };
    Column.prototype.getDayTimeFrame = function (date) {
        var dtf = this.daysTimeFrames[getDateKey(date)];
        if (dtf === undefined) {
            return [];
        }
        return dtf;
    };
    Column.prototype.getPositionByDate = function (date) {
        var positionDuration = void 0;
        var position = void 0;
        var croppedDate = date;
        if (this.timeFramesNonWorkingMode === 'cropped' || this.timeFramesWorkingMode === 'cropped') {
            var timeFrames = this.getDayTimeFrame(croppedDate);
            for (var i = 0; i < timeFrames.length; i++) {
                var timeFrame = timeFrames[i];
                if (croppedDate >= timeFrame.start && croppedDate <= timeFrame.end) {
                    if (timeFrame.cropped) {
                        if (timeFrames.length > i + 1) {
                            croppedDate = timeFrames[i + 1].start;
                        } else {
                            croppedDate = timeFrame.end;
                        }
                    } else {
                        positionDuration = croppedDate.diff(timeFrame.start, 'milliseconds');
                        position = positionDuration / timeFrame.getDuration() * timeFrame.width;
                        return this.left + timeFrame.left + position;
                    }
                }
            }
        }
        positionDuration = croppedDate.diff(this.date, 'milliseconds');
        position = positionDuration / this.duration * this.width;
        if (position < 0) {
            position = 0;
        }
        if (position > this.width) {
            position = this.width;
        }
        return this.left + position;
    };
    return Column;
};

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttColumn", function (GanttColumn) {
    'ngInject';

    var ColumnBuilder = function ColumnBuilder(columnsManager) {
        this.columnsManager = columnsManager;
    };
    ColumnBuilder.prototype.newColumn = function (date, endDate, left, width) {
        var calendar = this.columnsManager.gantt.calendar;
        var timeFramesWorkingMode = this.columnsManager.gantt.options.value('timeFramesWorkingMode');
        var timeFramesNonWorkingMode = this.columnsManager.gantt.options.value('timeFramesNonWorkingMode');
        return new GanttColumn(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode);
    };
    return ColumnBuilder;
}];

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var isToDateToExclude = function isToDateToExclude(to, value, unit) {
        return (0, _moment2.default)(to).add(value, unit).startOf(unit) === to;
    };
    var getFirstValue = function getFirstValue(unit) {
        if (['hour', 'minute', 'second', 'millisecond'].indexOf(unit) >= 0) {
            return 0;
        }
    };
    var ensureNoUnitOverflow = function ensureNoUnitOverflow(unit, startDate, endDate) {
        var v1 = startDate.get(unit);
        var v2 = endDate.get(unit);
        var firstValue = getFirstValue(unit);
        if (firstValue !== undefined && v2 !== firstValue && v2 < v1) {
            endDate.set(unit, firstValue);
        }
    };

    this.generate = function (builder, from, to, viewScale, columnWidth, maximumWidth, leftOffset, reverse) {
        if (!to && !maximumWidth) {
            throw 'to or maximumWidth must be defined';
        }
        viewScale = viewScale.trim();
        if (viewScale.charAt(viewScale.length - 1) === 's') {
            viewScale = viewScale.substring(0, viewScale.length - 1);
        }
        var viewScaleValue = void 0;
        var viewScaleUnit = void 0;
        var splittedViewScale = void 0;
        if (viewScale) {
            splittedViewScale = viewScale.split(' ');
        }
        if (splittedViewScale && splittedViewScale.length > 1) {
            viewScaleValue = parseFloat(splittedViewScale[0]);
            viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
        } else {
            viewScaleValue = 1;
            viewScaleUnit = viewScale;
        }
        var excludeTo = false;
        from = (0, _moment2.default)(from).startOf(viewScaleUnit);
        if (to) {
            excludeTo = isToDateToExclude(to, viewScaleValue, viewScaleUnit);
            to = (0, _moment2.default)(to).startOf(viewScaleUnit);
        }
        var left = 0;
        var date = (0, _moment2.default)(from).startOf(viewScaleUnit);
        if (reverse) {
            date.add(-viewScaleValue, viewScaleUnit);
            left -= columnWidth;
        }
        var generatedCols = [];
        while (true) {
            if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                break;
            }
            var startDate = (0, _moment2.default)(date);
            var endDate = (0, _moment2.default)(startDate).add(viewScaleValue, viewScaleUnit);
            ensureNoUnitOverflow(viewScaleUnit, startDate, endDate);
            var column = builder.newColumn(startDate, endDate, leftOffset ? left + leftOffset : left, columnWidth);
            if (!column.cropped) {
                generatedCols.push(column);
                if (reverse) {
                    left -= columnWidth;
                } else {
                    left += columnWidth;
                }
            }
            if (to) {
                if (reverse) {
                    if (excludeTo && date < to || !excludeTo && date <= to) {
                        break;
                    }
                } else {
                    if (excludeTo && date > to || !excludeTo && date >= to) {
                        break;
                    }
                }
            }
            if (reverse) {
                date.add(-viewScaleValue, viewScaleUnit);
                ensureNoUnitOverflow(viewScaleUnit, date, startDate);
            } else {
                date.add(viewScaleValue, viewScaleUnit);
                ensureNoUnitOverflow(viewScaleUnit, startDate, date);
            }
        }
        if (reverse) {
            if (isToDateToExclude(from, viewScaleValue, viewScaleUnit)) {
                generatedCols.shift();
            }
            generatedCols.reverse();
        }
        return generatedCols;
    };
};

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttColumn", function (GanttColumn) {
    'ngInject';

    var ColumnHeader = function ColumnHeader(startDate, endDate, viewScaleUnit, left, width, labelFormat, name) {
        startDate = (0, _moment2.default)(startDate);
        endDate = (0, _moment2.default)(endDate);
        var column = new GanttColumn(startDate, endDate, left, width);
        column.name = name;
        column.unit = viewScaleUnit;
        column.label = _angular2.default.isFunction(labelFormat) ? labelFormat(column) : startDate.format(labelFormat);
        return column;
    };
    return ColumnHeader;
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttColumnGenerator", "GanttColumnBuilder", "GanttHeadersGenerator", "$filter", "$timeout", "ganttLayout", "ganttBinarySearch", function (GanttColumnGenerator, GanttColumnBuilder, GanttHeadersGenerator, $filter, $timeout, ganttLayout, ganttBinarySearch) {
    'ngInject';

    var ColumnsManager = function ColumnsManager(gantt) {
        var self = this;
        this.gantt = gantt;
        this.from = undefined;
        this.to = undefined;
        this.columns = [];
        this.visibleColumns = [];
        this.previousColumns = [];
        this.nextColumns = [];
        this.headers = [];
        this.visibleHeaders = [];
        this.scrollAnchor = undefined;
        this.columnBuilder = new GanttColumnBuilder(this);

        this.gantt.$scope.$watchGroup(['viewScale', 'columnWidth', 'timeFramesWorkingMode', 'timeFramesNonWorkingMode', 'fromDate', 'toDate', 'autoExpand', 'taskOutOfRange'], function (newValues, oldValues) {
            if (newValues !== oldValues && self.gantt.rendered) {
                self.generateColumns();
            }
        });
        this.gantt.$scope.$watchCollection('headers', function (newValues, oldValues) {
            if (newValues !== oldValues && self.gantt.rendered) {
                self.generateColumns();
            }
        });
        this.gantt.$scope.$watchCollection('headersFormats', function (newValues, oldValues) {
            if (newValues !== oldValues && self.gantt.rendered) {
                self.generateColumns();
            }
        });
        this.gantt.$scope.$watchGroup(['ganttElementWidth', 'showSide', 'sideWidth', 'maxHeight', 'daily'], function (newValues, oldValues) {
            if (newValues !== oldValues && self.gantt.rendered) {
                self.updateColumnsMeta();
            }
        });
        this.gantt.api.data.on.load(this.gantt.$scope, function () {
            if ((self.from === undefined || self.to === undefined || self.from > self.gantt.rowsManager.getDefaultFrom() || self.to < self.gantt.rowsManager.getDefaultTo()) && self.gantt.rendered) {
                self.generateColumns();
            }
            self.gantt.rowsManager.sortRows();
        });
        this.gantt.api.data.on.remove(this.gantt.$scope, function () {
            self.gantt.rowsManager.sortRows();
        });
        this.gantt.api.registerMethod('columns', 'clear', this.clearColumns, this);
        this.gantt.api.registerMethod('columns', 'generate', this.generateColumns, this);
        this.gantt.api.registerMethod('columns', 'refresh', this.updateColumnsMeta, this);
        this.gantt.api.registerMethod('columns', 'getColumnsWidth', this.getColumnsWidth, this);
        this.gantt.api.registerMethod('columns', 'getColumnsWidthToFit', this.getColumnsWidthToFit, this);
        this.gantt.api.registerMethod('columns', 'getDateRange', this.getDateRange, this);
        this.gantt.api.registerEvent('columns', 'clear');
        this.gantt.api.registerEvent('columns', 'generate');
        this.gantt.api.registerEvent('columns', 'refresh');
    };
    ColumnsManager.prototype.setScrollAnchor = function () {
        if (this.gantt.scroll.$element && this.columns.length > 0) {
            var el = this.gantt.scroll.$element[0];
            var center = el.scrollLeft + el.offsetWidth / 2;
            this.scrollAnchor = this.gantt.getDateByPosition(center);
        }
    };
    ColumnsManager.prototype.scrollToScrollAnchor = function () {
        var self = this;
        if (this.columns.length > 0 && this.scrollAnchor !== undefined) {
            this.gantt.$scope.$$postDigest(function () {
                self.gantt.api.scroll.toDate(self.scrollAnchor);
            });
        }
    };
    ColumnsManager.prototype.clearColumns = function () {
        this.setScrollAnchor();
        this.from = undefined;
        this.to = undefined;
        this.columns = [];
        this.visibleColumns = [];
        this.previousColumns = [];
        this.nextColumns = [];
        this.headers = [];
        this.visibleHeaders = [];
        this.gantt.api.columns.raise.clear();
    };
    ColumnsManager.prototype.generateColumns = function (from, to) {
        if (!from) {
            from = this.gantt.options.value('fromDate');
        }
        if (!to) {
            to = this.gantt.options.value('toDate');
        }
        if (!from || _moment2.default.isMoment(from) && !from.isValid()) {
            from = this.gantt.rowsManager.getDefaultFrom();
            if (!from) {
                return false;
            }
        }
        if (!to || _moment2.default.isMoment(to) && !to.isValid()) {
            to = this.gantt.rowsManager.getDefaultTo();
            if (!to) {
                return false;
            }
        }
        if (from !== undefined && !_moment2.default.isMoment(from)) {
            from = (0, _moment2.default)(from);
        }
        if (to !== undefined && !_moment2.default.isMoment(to)) {
            to = (0, _moment2.default)(to);
        }
        if (this.gantt.options.value('taskOutOfRange') === 'expand') {
            from = this.gantt.rowsManager.getExpandedFrom(from);
            to = this.gantt.rowsManager.getExpandedTo(to);
        }
        this.setScrollAnchor();
        this.from = from;
        this.to = to;
        this.columns = GanttColumnGenerator.generate(this.columnBuilder, from, to, this.gantt.options.value('viewScale'), this.getColumnsWidth());
        this.headers = GanttHeadersGenerator.generate(this);
        this.previousColumns = [];
        this.nextColumns = [];
        this.updateColumnsMeta();
        this.scrollToScrollAnchor();
        this.gantt.api.columns.raise.generate(this.columns, this.headers);
    };
    ColumnsManager.prototype.updateColumnsMeta = function () {
        this.gantt.isRefreshingColumns = true;
        var lastColumn = this.getLastColumn();
        this.gantt.originalWidth = lastColumn !== undefined ? lastColumn.originalSize.left + lastColumn.originalSize.width : 0;
        var columnsWidthChanged = this.updateColumnsWidths(this.columns, this.headers, this.previousColumns, this.nextColumns);
        this.gantt.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;
        var showSide = this.gantt.options.value('showSide');
        var sideShown = this.gantt.side.isShown();
        var sideVisibilityChanged = showSide !== sideShown;
        if (sideVisibilityChanged && !showSide) {
            this.gantt.side.show(false);
        }
        this.gantt.rowsManager.updateTasksPosAndSize();
        this.gantt.timespansManager.updateTimespansPosAndSize();
        this.updateVisibleColumns(columnsWidthChanged);
        this.gantt.rowsManager.updateVisibleObjects();
        var currentDateValue = this.gantt.options.value('currentDateValue');
        this.gantt.currentDateManager.setCurrentDate(currentDateValue);
        if (sideVisibilityChanged && showSide) {
            this.gantt.side.show(true);
        }
        this.gantt.isRefreshingColumns = false;
        this.gantt.api.columns.raise.refresh(this.columns, this.headers);
    };

    ColumnsManager.prototype.getLastColumn = function (extended) {
        var columns = this.columns;
        if (extended) {
            columns = this.nextColumns;
        }
        if (columns && columns.length > 0) {
            return columns[columns.length - 1];
        } else {
            return undefined;
        }
    };

    ColumnsManager.prototype.getFirstColumn = function (extended) {
        var columns = this.columns;
        if (extended) {
            columns = this.previousColumns;
        }
        if (columns && columns.length > 0) {
            return columns[0];
        } else {
            return undefined;
        }
    };

    ColumnsManager.prototype.getColumnByDate = function (date, disableExpand) {
        if (!disableExpand) {
            this.expandExtendedColumnsForDate(date);
        }
        var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
        var columns = ganttBinarySearch.get(extendedColumns, date, function (c) {
            return c.date;
        }, true);
        return columns[0] === undefined ? columns[1] : columns[0];
    };

    ColumnsManager.prototype.getColumnByPosition = function (x, disableExpand) {
        if (!disableExpand) {
            this.expandExtendedColumnsForPosition(x);
        }
        var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
        var columns = ganttBinarySearch.get(extendedColumns, x, function (c) {
            return c.left;
        }, true);
        return columns[0] === undefined ? columns[1] : columns[0];
    };
    ColumnsManager.prototype.updateColumnsWidths = function (columns, headers, previousColumns, nextColumns) {
        var columnWidth = this.gantt.options.value('columnWidth');
        var expandToFit = this.gantt.options.value('expandToFit');
        var shrinkToFit = this.gantt.options.value('shrinkToFit');
        if (columnWidth === undefined || expandToFit || shrinkToFit) {
            var newWidth = this.gantt.getBodyAvailableWidth();
            var lastColumn = this.gantt.columnsManager.getLastColumn(false);
            if (lastColumn !== undefined) {
                var currentWidth = lastColumn.originalSize.left + lastColumn.originalSize.width;
                if (expandToFit && currentWidth < newWidth || shrinkToFit && currentWidth > newWidth || columnWidth === undefined) {
                    var widthFactor = newWidth / currentWidth;
                    ganttLayout.setColumnsWidthFactor(columns, widthFactor);
                    for (var i = 0; i < headers.length; i++) {
                        ganttLayout.setColumnsWidthFactor(headers[i], widthFactor);
                    }

                    previousColumns.splice(0, this.previousColumns.length);
                    nextColumns.splice(0, this.nextColumns.length);
                    return true;
                }
            }
        }
        return false;
    };
    ColumnsManager.prototype.getColumnsWidth = function () {
        var columnWidth = this.gantt.options.value('columnWidth');
        if (columnWidth === undefined) {
            if (!this.gantt.width || this.gantt.width <= 0) {
                columnWidth = 20;
            } else {
                columnWidth = this.gantt.width / this.columns.length;
            }
        }
        return columnWidth;
    };
    ColumnsManager.prototype.getColumnsWidthToFit = function () {
        return this.gantt.getBodyAvailableWidth() / this.columns.length;
    };
    ColumnsManager.prototype.expandExtendedColumnsForPosition = function (x) {
        var viewScale = void 0;
        if (x < 0) {
            var firstColumn = this.getFirstColumn();
            var from = firstColumn.date;
            var firstExtendedColumn = this.getFirstColumn(true);
            if (!firstExtendedColumn || firstExtendedColumn.left > x) {
                viewScale = this.gantt.options.value('viewScale');
                this.previousColumns = GanttColumnGenerator.generate(this.columnBuilder, from, undefined, viewScale, this.getColumnsWidth(), -x, 0, true);
            }
            return true;
        } else if (x > this.gantt.width) {
            var lastColumn = this.getLastColumn();
            var endDate = lastColumn.getDateByPosition(lastColumn.width);
            var lastExtendedColumn = this.getLastColumn(true);
            if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
                viewScale = this.gantt.options.value('viewScale');
                this.nextColumns = GanttColumnGenerator.generate(this.columnBuilder, endDate, undefined, viewScale, this.getColumnsWidth(), x - this.gantt.width, this.gantt.width, false);
            }
            return true;
        }
        return false;
    };
    ColumnsManager.prototype.expandExtendedColumnsForDate = function (date) {
        var firstColumn = this.getFirstColumn();
        var from = void 0;
        if (firstColumn) {
            from = firstColumn.date;
        }
        var lastColumn = this.getLastColumn();
        var endDate = void 0;
        if (lastColumn) {
            endDate = lastColumn.endDate;
        }
        var viewScale = void 0;
        if (from && date < from) {
            var firstExtendedColumn = this.getFirstColumn(true);
            if (!firstExtendedColumn || firstExtendedColumn.date > date) {
                viewScale = this.gantt.options.value('viewScale');
                this.previousColumns = GanttColumnGenerator.generate(this.columnBuilder, from, date, viewScale, this.getColumnsWidth(), undefined, 0, true);
            }
            return true;
        } else if (endDate && date >= endDate) {
            var lastExtendedColumn = this.getLastColumn(true);
            if (!lastExtendedColumn || lastExtendedColumn.date < endDate) {
                viewScale = this.gantt.options.value('viewScale');
                this.nextColumns = GanttColumnGenerator.generate(this.columnBuilder, endDate, date, viewScale, this.getColumnsWidth(), undefined, this.gantt.width, false);
            }
            return true;
        }
        return false;
    };

    ColumnsManager.prototype.getActiveHeadersCount = function () {
        return this.headers.length;
    };
    ColumnsManager.prototype.updateVisibleColumns = function (includeViews) {
        var limitThreshold = this.gantt.options.value('columnLimitThreshold');
        var i = void 0;
        if (limitThreshold === undefined || limitThreshold > 0 && this.columns.length >= limitThreshold) {
            this.visibleColumns = $filter('ganttColumnLimit')(this.columns, this.gantt);
            this.visibleHeaders = [];
            for (i = 0; i < this.headers.length; i++) {
                this.visibleHeaders.push($filter('ganttColumnLimit')(this.headers[i], this.gantt));
            }
        } else {
            this.visibleColumns = this.columns;
            this.visibleHeaders = this.headers;
        }
        if (includeViews) {
            for (i = 0; i < this.visibleColumns.length; i++) {
                this.visibleColumns[i].updateView();
            }
            for (i = 0; i < this.visibleHeaders.length; i++) {
                var headerRow = this.visibleHeaders[i];
                for (var j = 0; j < headerRow.length; j++) {
                    headerRow[j].updateView();
                }
            }
        }
        var currentDateValue = this.gantt.options.value('currentDateValue');
        this.gantt.currentDateManager.setCurrentDate(currentDateValue);
    };
    var defaultHeadersFormats = {
        year: 'YYYY',
        quarter: '[Q]Q YYYY',
        month: 'MMMM YYYY',
        week: 'w',
        day: 'D',
        hour: 'H',
        minute: 'H:mm',
        second: 'H:mm:ss',
        millisecond: 'H:mm:ss:SSS'
    };
    var defaultDayHeadersFormats = { day: 'LL', hour: 'H', minute: 'H:mm', second: 'H:mm:ss', millisecond: 'H:mm:ss:SSS' };
    var defaultYearHeadersFormats = { 'year': 'YYYY', 'quarter': '[Q]Q', month: 'MMMM' };
    ColumnsManager.prototype.getHeaderFormat = function (unit) {
        var format = void 0;
        var headersFormats = this.gantt.options.value('headersFormats');
        if (headersFormats !== undefined) {
            format = headersFormats[unit];
        }
        if (format === undefined) {
            var viewScale = this.gantt.options.value('viewScale');
            viewScale = viewScale.trim();
            if (viewScale.charAt(viewScale.length - 1) === 's') {
                viewScale = viewScale.substring(0, viewScale.length - 1);
            }
            var viewScaleUnit = void 0;
            var splittedViewScale = void 0;
            if (viewScale) {
                splittedViewScale = viewScale.split(' ');
            }
            if (splittedViewScale && splittedViewScale.length > 1) {
                viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
            } else {
                viewScaleUnit = viewScale;
            }
            if (['millisecond', 'second', 'minute', 'hour'].indexOf(viewScaleUnit) > -1) {
                format = defaultDayHeadersFormats[unit];
            } else if (['month', 'quarter', 'year'].indexOf(viewScaleUnit) > -1) {
                format = defaultYearHeadersFormats[unit];
            }
            if (format === undefined) {
                format = defaultHeadersFormats[unit];
            }
        }
        return format;
    };
    ColumnsManager.prototype.getHeaderScale = function (header) {
        var scale = void 0;
        var headersScales = this.gantt.options.value('headersScales');
        if (headersScales !== undefined) {
            scale = headersScales[header];
        }
        if (scale === undefined) {
            scale = header;
        }
        if (['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'].indexOf(scale) === -1) {
            scale = 'day';
        }
        return scale;
    };
    ColumnsManager.prototype.getDateRange = function (visibleOnly) {
        var firstColumn = void 0;
        var lastColumn = void 0;
        if (visibleOnly) {
            if (this.visibleColumns && this.visibleColumns.length > 0) {
                firstColumn = this.visibleColumns[0];
                lastColumn = this.visibleColumns[this.visibleColumns.length - 1];
            }
        } else {
            firstColumn = this.getFirstColumn();
            lastColumn = this.getLastColumn();
        }
        return firstColumn && lastColumn ? [firstColumn.date, lastColumn.endDate] : undefined;
    };
    return ColumnsManager;
}];

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttColumnHeader", function (GanttColumnHeader) {
    'ngInject';

    var generateHeader = function generateHeader(columnsManager, headerName) {
        var generatedHeaders = [];
        var header = void 0;
        var viewScale = columnsManager.getHeaderScale(headerName);
        var viewScaleValue = void 0;
        var viewScaleUnit = void 0;
        var splittedViewScale = void 0;
        if (viewScale) {
            splittedViewScale = viewScale.split(' ');
        }
        if (splittedViewScale && splittedViewScale.length > 1) {
            viewScaleValue = parseFloat(splittedViewScale[0]);
            viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
        } else {
            viewScaleValue = 1;
            viewScaleUnit = viewScale;
        }
        if (columnsManager.columns.length > 0) {
            var currentColumn = columnsManager.columns[0];
            var currentDate = (0, _moment2.default)(currentColumn.date).startOf(viewScaleUnit);
            var maximumDate = (0, _moment2.default)(columnsManager.columns[columnsManager.columns.length - 1].endDate);
            while (true) {
                var currentPosition = currentColumn.getPositionByDate(currentDate);
                var endDate = _moment2.default.min((0, _moment2.default)(currentDate).add(viewScaleValue, viewScaleUnit), maximumDate);
                var column = columnsManager.getColumnByDate(endDate);
                var left = column.getPositionByDate(endDate);
                var width = left - currentPosition;
                if (width > 0) {
                    var labelFormat = columnsManager.getHeaderFormat(headerName);
                    header = new GanttColumnHeader(currentDate, endDate, viewScaleUnit, currentPosition, width, labelFormat, headerName);
                    generatedHeaders.push(header);
                }
                if (endDate.isSame(maximumDate) || endDate.isAfter(maximumDate)) {
                    break;
                }
                currentColumn = column;
                currentDate = endDate;
            }
        }
        return generatedHeaders;
    };
    this.generate = function (columnsManager) {
        var headerNames = [];
        if (columnsManager.gantt.options.value('headers') === undefined) {
            var viewScale = columnsManager.gantt.options.value('viewScale');
            viewScale = viewScale.trim();
            if (viewScale.charAt(viewScale.length - 1) === 's') {
                viewScale = viewScale.substring(0, viewScale.length - 1);
            }
            var viewScaleUnit = void 0;
            var splittedViewScale = void 0;
            if (viewScale) {
                splittedViewScale = viewScale.split(' ');
            }
            if (splittedViewScale && splittedViewScale.length > 1) {
                viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
            } else {
                viewScaleUnit = viewScale;
            }
            if (['quarter', 'month'].indexOf(viewScaleUnit) > -1) {
                headerNames.push('year');
            }
            if (['day', 'week'].indexOf(viewScaleUnit) > -1) {
                headerNames.push('month');
            }
            if (['day'].indexOf(viewScaleUnit) > -1) {
                headerNames.push('week');
            }
            if (['hour'].indexOf(viewScaleUnit) > -1) {
                headerNames.push('day');
            }
            if (['minute', 'second', 'millisecond'].indexOf(viewScaleUnit) > -1) {
                headerNames.push('hour');
            }
            if (['second', 'millisecond'].indexOf(viewScaleUnit) > -1) {
                headerNames.push('minute');
            }
            if (['millisecond'].indexOf(viewScaleUnit) > -1) {
                headerNames.push('second');
            }
            headerNames.push(viewScale);
        } else {
            headerNames = columnsManager.gantt.options.value('headers');
        }
        var headers = [];
        for (var i = 0; i < headerNames.length; i++) {
            headers.push(generateHeader(columnsManager, headerNames[i]));
        }
        return headers;
    };
}];

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttApi", "GanttOptions", "GanttCalendar", "GanttScroll", "GanttBody", "GanttRowHeader", "GanttHeader", "GanttSide", "GanttObjectModel", "GanttRowsManager", "GanttColumnsManager", "GanttTimespansManager", "GanttCurrentDateManager", "ganttArrays", "$document", "$timeout", function (GanttApi, GanttOptions, GanttCalendar, GanttScroll, GanttBody, GanttRowHeader, GanttHeader, GanttSide, GanttObjectModel, GanttRowsManager, GanttColumnsManager, GanttTimespansManager, GanttCurrentDateManager, ganttArrays, $document, $timeout) {
    'ngInject';

    var Gantt = function Gantt($scope, $element) {
        var self = this;
        this.$scope = $scope;
        this.$element = $element;
        this.options = new GanttOptions($scope, {
            'api': _angular2.default.noop,
            'data': [],
            'timespans': [],
            'viewScale': 'day',
            'columnMagnet': '15 minutes',
            'timeFramesMagnet': true,
            'showSide': true,
            'allowSideResizing': true,
            'currentDate': 'line',
            'currentDateValue': _moment2.default,
            'autoExpand': 'none',
            'taskOutOfRange': 'truncate',
            'taskContent': '{{task.model.name}}',
            'rowContent': '{{row.model.name}}',
            'maxHeight': 0,
            'timeFrames': [],
            'dateFrames': [],
            'timeFramesWorkingMode': 'hidden',
            'timeFramesNonWorkingMode': 'visible',
            'taskLimitThreshold': 100,
            'columnLimitThreshold': 500
        });
        this.api = new GanttApi(this);
        this.api.registerEvent('core', 'ready');
        this.api.registerEvent('core', 'rendered');
        this.api.registerEvent('directives', 'controller');
        this.api.registerEvent('directives', 'preLink');
        this.api.registerEvent('directives', 'postLink');
        this.api.registerEvent('directives', 'new');
        this.api.registerEvent('directives', 'destroy');
        this.api.registerEvent('data', 'change');
        this.api.registerEvent('data', 'load');
        this.api.registerEvent('data', 'remove');
        this.api.registerEvent('data', 'clear');
        this.api.registerMethod('core', 'getDateByPosition', this.getDateByPosition, this);
        this.api.registerMethod('core', 'getPositionByDate', this.getPositionByDate, this);
        this.api.registerMethod('data', 'load', this.loadData, this);
        this.api.registerMethod('data', 'remove', this.removeData, this);
        this.api.registerMethod('data', 'clear', this.clearData, this);
        this.api.registerMethod('data', 'get', this.getData, this);
        this.calendar = new GanttCalendar(this);
        this.calendar.registerTimeFrames(this.options.value('timeFrames'));
        this.calendar.registerDateFrames(this.options.value('dateFrames'));
        this.api.registerMethod('timeframes', 'registerTimeFrames', this.calendar.registerTimeFrames, this.calendar);
        this.api.registerMethod('timeframes', 'clearTimeframes', this.calendar.clearTimeFrames, this.calendar);
        this.api.registerMethod('timeframes', 'registerDateFrames', this.calendar.registerDateFrames, this.calendar);
        this.api.registerMethod('timeframes', 'clearDateFrames', this.calendar.clearDateFrames, this.calendar);
        this.api.registerMethod('timeframes', 'registerTimeFrameMappings', this.calendar.registerTimeFrameMappings, this.calendar);
        this.api.registerMethod('timeframes', 'clearTimeFrameMappings', this.calendar.clearTimeFrameMappings, this.calendar);
        $scope.$watchGroup(['timeFrames', 'dateFrames'], function (newValues, oldValues) {
            if (newValues !== oldValues) {
                var timeFrames = newValues[0];
                var dateFrames = newValues[1];
                var oldTimeFrames = oldValues[0];
                var oldDateFrames = oldValues[1];
                var framesChanged = false;
                if (!_angular2.default.equals(timeFrames, oldTimeFrames)) {
                    self.calendar.clearTimeFrames();
                    self.calendar.registerTimeFrames(timeFrames);
                    framesChanged = true;
                }
                if (!_angular2.default.equals(dateFrames, oldDateFrames)) {
                    self.calendar.clearDateFrames();
                    self.calendar.registerDateFrames(dateFrames);
                    framesChanged = true;
                }
                if (framesChanged) {
                    self.columnsManager.generateColumns();
                }
            }
        });
        $scope.$watch('columnMagnet', function () {
            var splittedColumnMagnet = void 0;
            var columnMagnet = self.options.value('columnMagnet');
            if (columnMagnet) {
                splittedColumnMagnet = columnMagnet.trim().split(' ');
            }
            if (splittedColumnMagnet && splittedColumnMagnet.length > 1) {
                self.columnMagnetValue = parseFloat(splittedColumnMagnet[0]);
                self.columnMagnetUnit = _moment2.default.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
            } else {
                self.columnMagnetValue = 1;
                self.columnMagnetUnit = _moment2.default.normalizeUnits(columnMagnet);
            }
        });
        $scope.$watchGroup(['shiftColumnMagnet', 'viewScale'], function () {
            var splittedColumnMagnet = void 0;
            var shiftColumnMagnet = self.options.value('shiftColumnMagnet');
            if (shiftColumnMagnet) {
                splittedColumnMagnet = shiftColumnMagnet.trim().split(' ');
            }
            if (splittedColumnMagnet !== undefined && splittedColumnMagnet.length > 1) {
                self.shiftColumnMagnetValue = parseFloat(splittedColumnMagnet[0]);
                self.shiftColumnMagnetUnit = _moment2.default.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
            } else {
                self.shiftColumnMagnetValue = 1;
                self.shiftColumnMagnetUnit = _moment2.default.normalizeUnits(shiftColumnMagnet);
            }
        });
        var keyHandler = function keyHandler(e) {
            self.shiftKey = e.shiftKey;
            return true;
        };
        $document.on('keyup keydown', keyHandler);
        $scope.$on('$destroy', function () {
            $document.off('keyup keydown', keyHandler);
        });
        this.scroll = new GanttScroll(this);
        this.body = new GanttBody(this);
        this.header = new GanttHeader(this);
        this.side = new GanttSide(this);
        this.objectModel = new GanttObjectModel(this.api);
        this.rowsManager = new GanttRowsManager(this);
        this.columnsManager = new GanttColumnsManager(this);
        this.timespansManager = new GanttTimespansManager(this);
        this.currentDateManager = new GanttCurrentDateManager(this);
        this.originalWidth = 0;
        this.width = 0;
        if (_angular2.default.isFunction(this.$scope.api)) {
            this.$scope.api(this.api);
        }
        var hasRowModelOrderChanged = function hasRowModelOrderChanged(data1, data2) {
            if (data2 === undefined || data1.length !== data2.length) {
                return true;
            }

            for (var i = 0, l = data1.length; i < l; i++) {
                if (data1[i].id !== data2[i].id) {
                    return true;
                }
            }
            return false;
        };
        $scope.$watchCollection('data', function (newData, oldData) {
            if (oldData !== undefined) {
                var toRemoveIds = ganttArrays.getRemovedIds(newData, oldData);
                if (toRemoveIds.length === oldData.length) {
                    self.rowsManager.removeAll();

                    self.api.data.raise.clear();
                } else {
                    for (var i = 0, l = toRemoveIds.length; i < l; i++) {
                        var toRemoveId = toRemoveIds[i];
                        self.rowsManager.removeRow(toRemoveId);
                    }

                    var removedRows = [];
                    for (var _i = 0, _l = oldData.length; _i < _l; _i++) {
                        if (toRemoveIds.indexOf(oldData[_i].id) > -1) {
                            removedRows.push(oldData[_i]);
                        }
                    }
                    self.api.data.raise.remove(removedRows);
                }
            }
            if (newData !== undefined) {
                var modelOrderChanged = hasRowModelOrderChanged(newData, oldData);
                if (modelOrderChanged) {
                    self.rowsManager.resetNonModelLists();
                }
                for (var j = 0, k = newData.length; j < k; j++) {
                    var rowData = newData[j];
                    self.rowsManager.addRow(rowData, modelOrderChanged);
                }
                self.api.data.raise.change(newData, oldData);

                self.api.data.raise.load(newData);
            }
        });
    };

    Gantt.prototype.getMagnetValueAndUnit = function () {
        if (this.shiftKey) {
            if (this.shiftColumnMagnetValue !== undefined && this.shiftColumnMagnetUnit !== undefined) {
                return [this.shiftColumnMagnetValue, this.shiftColumnMagnetUnit];
            } else {
                var viewScale = this.options.value('viewScale');
                viewScale = viewScale.trim();
                var viewScaleValue = void 0;
                var viewScaleUnit = void 0;
                var splittedViewScale = void 0;
                if (viewScale) {
                    splittedViewScale = viewScale.split(' ');
                }
                if (splittedViewScale && splittedViewScale.length > 1) {
                    viewScaleValue = parseFloat(splittedViewScale[0]);
                    viewScaleUnit = _moment2.default.normalizeUnits(splittedViewScale[splittedViewScale.length - 1]);
                } else {
                    viewScaleValue = 1;
                    viewScaleUnit = _moment2.default.normalizeUnits(viewScale);
                }
                return [viewScaleValue * 0.25, viewScaleUnit];
            }
        } else {
            return [this.columnMagnetValue, this.columnMagnetUnit];
        }
    };

    Gantt.prototype.getMagnetDate = function (date, disableExpand) {
        if (date === undefined) {
            return undefined;
        }
        if (!_moment2.default.isMoment(_moment2.default)) {
            date = (0, _moment2.default)(date);
        }
        var column = this.columnsManager.getColumnByDate(date, disableExpand);
        var magnetValueAndUnit = this.getMagnetValueAndUnit();
        var magnetValue = magnetValueAndUnit[0];
        var magnetUnit = magnetValueAndUnit[1];
        return column.getMagnetDate(date, magnetValue, magnetUnit, this.options.value('timeFramesMagnet'));
    };

    Gantt.prototype.getDateByPosition = function (x, magnet, disableExpand) {
        var column = this.columnsManager.getColumnByPosition(x, disableExpand);
        if (column !== undefined) {
            var magnetValue = void 0;
            var magnetUnit = void 0;
            if (magnet) {
                var magnetValueAndUnit = this.getMagnetValueAndUnit();
                magnetValue = magnetValueAndUnit[0];
                magnetUnit = magnetValueAndUnit[1];
            }
            return column.getDateByPosition(x - column.left, magnetValue, magnetUnit, this.options.value('timeFramesMagnet'));
        } else {
            return undefined;
        }
    };
    Gantt.prototype.getBodyAvailableWidth = function () {
        var scrollWidth = this.getWidth() - this.side.getWidth();
        var borderWidth = this.scroll.getBordersWidth();
        var availableWidth = scrollWidth - (borderWidth !== undefined ? this.scroll.getBordersWidth() : 0);

        availableWidth = availableWidth - 1;
        return availableWidth;
    };

    Gantt.prototype.getPositionByDate = function (date, disableExpand) {
        if (date === undefined) {
            return undefined;
        }
        if (!_moment2.default.isMoment(_moment2.default)) {
            date = (0, _moment2.default)(date);
        }
        var column = this.columnsManager.getColumnByDate(date, disableExpand);
        if (column !== undefined) {
            return column.getPositionByDate(date);
        } else {
            return undefined;
        }
    };

    Gantt.prototype.loadData = function (data) {
        if (!_angular2.default.isArray(data)) {
            data = data !== undefined ? [data] : [];
        }
        if (this.$scope.data === undefined) {
            this.$scope.data = data;
        } else {
            for (var i = 0, l = data.length; i < l; i++) {
                var row = data[i];
                var j = ganttArrays.indexOfId(this.$scope.data, row.id);
                if (j > -1) {
                    this.$scope.data[j] = row;
                } else {
                    this.$scope.data.push(row);
                }
            }
        }
        var w = this.side.getWidth();
        if (w > 0) {
            this.options.set('sideWidth', w);
        }
    };
    Gantt.prototype.getData = function () {
        return this.$scope.data;
    };

    Gantt.prototype.removeData = function (data) {
        if (!_angular2.default.isArray(data)) {
            data = data !== undefined ? [data] : [];
        }
        if (this.$scope.data !== undefined) {
            for (var i = 0, l = data.length; i < l; i++) {
                var rowToRemove = data[i];
                var j = ganttArrays.indexOfId(this.$scope.data, rowToRemove.id);
                if (j > -1) {
                    if (rowToRemove.tasks === undefined || rowToRemove.tasks.length === 0) {
                        this.$scope.data.splice(j, 1);
                    } else {
                        var row = this.$scope.data[j];
                        for (var ti = 0, tl = rowToRemove.tasks.length; ti < tl; ti++) {
                            var taskToRemove = rowToRemove.tasks[ti];
                            var tj = ganttArrays.indexOfId(row.tasks, taskToRemove.id);
                            if (tj > -1) {
                                row.tasks.splice(tj, 1);
                            }
                        }
                    }
                }
            }
        }
    };

    Gantt.prototype.clearData = function () {
        this.$scope.data = undefined;
    };
    Gantt.prototype.getWidth = function () {
        return this.$scope.ganttElementWidth;
    };
    Gantt.prototype.getHeight = function () {
        return this.$scope.ganttElementHeight;
    };
    Gantt.prototype.getContainerWidth = function () {
        return this.$scope.ganttContainerWidth;
    };
    Gantt.prototype.getContainerHeight = function () {
        return this.$scope.ganttContainerHeight;
    };
    Gantt.prototype.initialized = function () {
        this.api.core.raise.ready(this.api);
        this.rendered = true;
        this.columnsManager.generateColumns();
        var gantt = this;
        var renderedFunction = function renderedFunction() {
            var w = gantt.side.getWidth();
            if (w > 0) {
                gantt.options.set('sideWidth', w);
            }
            gantt.api.core.raise.rendered(gantt.api);
        };
        $timeout(renderedFunction);
    };
    return Gantt;
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["ganttUtils", function (ganttUtils) {
    'ngInject';

    var ObjectModel = function ObjectModel(api) {
        this.api = api;
        this.api.registerEvent('tasks', 'clean');
        this.api.registerEvent('rows', 'clean');
        this.api.registerEvent('timespans', 'clean');
    };
    ObjectModel.prototype.cleanTask = function (model) {
        if (model.id === undefined) {
            model.id = ganttUtils.randomUuid();
        }
        if (model.from !== undefined && !_moment2.default.isMoment(model.from)) {
            model.from = (0, _moment2.default)(model.from);
        }
        if (model.to !== undefined && !_moment2.default.isMoment(model.to)) {
            model.to = (0, _moment2.default)(model.to);
        }
        this.api.tasks.raise.clean(model);
    };
    ObjectModel.prototype.cleanRow = function (model) {
        if (model.id === undefined) {
            model.id = ganttUtils.randomUuid();
        }
        if (model.from !== undefined && !_moment2.default.isMoment(model.from)) {
            model.from = (0, _moment2.default)(model.from);
        }
        if (model.to !== undefined && !_moment2.default.isMoment(model.to)) {
            model.to = (0, _moment2.default)(model.to);
        }
        this.api.rows.raise.clean(model);
    };
    ObjectModel.prototype.cleanTimespan = function (model) {
        if (model.id === undefined) {
            model.id = ganttUtils.randomUuid();
        }
        if (model.from !== undefined && !_moment2.default.isMoment(model.from)) {
            model.from = (0, _moment2.default)(model.from);
        }
        if (model.to !== undefined && !_moment2.default.isMoment(model.to)) {
            model.to = (0, _moment2.default)(model.to);
        }
        this.api.timespans.raise.clean(model);
    };
    return ObjectModel;
}];

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = __webpack_require__(2);

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = ["GanttTask", "$filter", function (GanttTask, $filter) {
    'ngInject';

    var Row = function Row(rowsManager, model) {
        this.rowsManager = rowsManager;
        this.model = model;
        this.from = undefined;
        this.to = undefined;
        this.tasksMap = {};
        this.tasks = [];
        this.filteredTasks = [];
        this.visibleTasks = [];
    };
    Row.prototype.addTaskImpl = function (task, viewOnly) {
        this.tasksMap[task.model.id] = task;
        this.tasks.push(task);
        if (!viewOnly) {
            if (this.model.tasks === undefined) {
                this.model.tasks = [];
            }
            if (this.model.tasks.indexOf(task.model) === -1) {
                this.model.tasks.push(task.model);
            }
        }
    };

    Row.prototype.addTask = function (taskModel, viewOnly) {
        var task = void 0;
        var isUpdate = false;
        this.rowsManager.gantt.objectModel.cleanTask(taskModel);
        if (taskModel.id in this.tasksMap) {
            task = this.tasksMap[taskModel.id];
            if (task.model === taskModel) {
                return task;
            }
            task.model = taskModel;
            isUpdate = true;
        } else {
            task = new GanttTask(this, taskModel);
            this.addTaskImpl(task, viewOnly);
        }
        this.sortTasks();
        this.setFromToByTask(task);
        if (!viewOnly) {
            if (isUpdate) {
                this.rowsManager.gantt.api.tasks.raise.change(task);
            } else {
                this.rowsManager.gantt.api.tasks.raise.add(task);
            }
        }
        return task;
    };

    Row.prototype.moveTaskToRow = function (task, viewOnly) {
        this.rowsManager.gantt.api.tasks.raise.beforeViewRowChange(task, this);
        if (!viewOnly) {
            this.rowsManager.gantt.api.tasks.raise.beforeRowChange(task, this);
        }
        var oldRow = task.row;
        oldRow.removeTask(task.model.id, viewOnly, true);
        task.row = this;
        this.addTaskImpl(task, viewOnly);
        this.sortTasks();
        this.setFromToByTask(task);
        task.updatePosAndSize();
        this.updateVisibleTasks();
        oldRow.$scope.$digest();
        task.row.$scope.$digest();
        this.rowsManager.gantt.api.tasks.raise.viewRowChange(task, oldRow);
        if (!viewOnly) {
            this.rowsManager.gantt.api.tasks.raise.rowChange(task, oldRow);
        }
    };
    Row.prototype.updateVisibleTasks = function () {
        var filterTask = this.rowsManager.gantt.options.value('filterTask');
        if (filterTask) {
            if ((typeof filterTask === 'undefined' ? 'undefined' : (0, _typeof3.default)(filterTask)) === 'object') {
                filterTask = { model: filterTask };
            }
            var _filterTaskComparator = this.rowsManager.gantt.options.value('filterTaskComparator');
            if (typeof _filterTaskComparator === 'function') {
                _filterTaskComparator = function filterTaskComparator(actual, expected) {
                    return _filterTaskComparator(actual.model, expected.model);
                };
            }
            this.filteredTasks = $filter('filter')(this.tasks, filterTask, _filterTaskComparator);
        } else {
            this.filteredTasks = this.tasks.slice(0);
        }
        var limitThreshold = this.rowsManager.gantt.options.value('taskLimitThreshold');
        if (limitThreshold === undefined || limitThreshold > 0 && this.filteredTasks.length >= limitThreshold) {
            this.visibleTasks = $filter('ganttTaskLimit')(this.filteredTasks, this.rowsManager.gantt);
        } else {
            this.visibleTasks = this.filteredTasks;
        }
    };
    Row.prototype.updateTasksPosAndSize = function () {
        for (var j = 0, k = this.tasks.length; j < k; j++) {
            this.tasks[j].updatePosAndSize();
        }
    };

    Row.prototype.removeTask = function (taskId, viewOnly, silent) {
        if (taskId in this.tasksMap) {
            var removedTask = this.tasksMap[taskId];
            var task = void 0;
            var i = void 0;
            for (i = this.tasks.length - 1; i >= 0; i--) {
                task = this.tasks[i];
                if (task.model.id === taskId) {
                    this.tasks.splice(i, 1);
                    if (this.from - task.model.from === 0 || this.to - task.model.to === 0) {
                        this.setFromTo();
                    }
                    break;
                }
            }
            for (i = this.filteredTasks.length - 1; i >= 0; i--) {
                task = this.filteredTasks[i];
                if (task.model.id === taskId) {
                    this.filteredTasks.splice(i, 1);
                    break;
                }
            }
            for (i = this.visibleTasks.length - 1; i >= 0; i--) {
                task = this.visibleTasks[i];
                if (task.model.id === taskId) {
                    this.visibleTasks.splice(i, 1);
                    break;
                }
            }
            if (!viewOnly) {
                delete this.tasksMap[taskId];
                if (this.model.tasks !== undefined) {
                    var taskIndex = this.model.tasks.indexOf(removedTask.model);
                    if (taskIndex > -1) {
                        this.model.tasks.splice(taskIndex, 1);
                    }
                }
                if (!silent) {
                    this.rowsManager.gantt.api.tasks.raise.remove(removedTask);
                }
            }
            return removedTask;
        }
    };
    Row.prototype.removeAllTasks = function () {
        this.from = undefined;
        this.to = undefined;
        this.tasksMap = {};
        this.tasks = [];
        this.filteredTasks = [];
        this.visibleTasks = [];
    };

    Row.prototype.setFromTo = function () {
        this.from = undefined;
        this.to = undefined;
        for (var j = 0, k = this.tasks.length; j < k; j++) {
            this.setFromToByTask(this.tasks[j]);
        }
    };
    Row.prototype.setFromToByTask = function (task) {
        this.setFromToByValues(task.model.from, task.model.to);
    };
    Row.prototype.setFromToByValues = function (from, to) {
        if (from !== undefined) {
            if (this.from === undefined) {
                this.from = (0, _moment2.default)(from);
            } else if (from < this.from) {
                this.from = (0, _moment2.default)(from);
            }
        }
        if (to !== undefined) {
            if (this.to === undefined) {
                this.to = (0, _moment2.default)(to);
            } else if (to > this.to) {
                this.to = (0, _moment2.default)(to);
            }
        }
    };
    Row.prototype.sortTasks = function () {
        this.tasks.sort(function (t1, t2) {
            return t1.left - t2.left;
        });
    };
    Row.prototype.clone = function () {
        var clone = new Row(this.rowsManager, _angular2.default.copy(this));
        for (var i = 0, l = this.tasks.length; i < l; i++) {
            clone.addTask(this.tasks[i].model);
        }
        return clone;
    };
    return Row;
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var RowHeader = function RowHeader(gantt) {
        this.gantt = gantt;
    };
    return RowHeader;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = __webpack_require__(2);

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = ["GanttRow", "ganttArrays", "$filter", "$timeout", function (GanttRow, ganttArrays, $filter, $timeout) {
    'ngInject';

    var RowsManager = function RowsManager(gantt) {
        var self = this;
        this.gantt = gantt;
        this.rowsMap = {};
        this.rows = [];
        this.sortedRows = [];
        this.filteredRows = [];
        this.customFilteredRows = [];
        this.visibleRows = [];
        this.rowsTaskWatchers = [];
        this._defaultFilterImpl = function (sortedRows, filterRow, filterRowComparator) {
            return $filter('filter')(sortedRows, filterRow, filterRowComparator);
        };
        this.filterImpl = this._defaultFilterImpl;
        this.customRowSorters = [];
        this.customRowFilters = [];
        this.gantt.$scope.$watchGroup(['filterTask', 'filterTaskComparator'], function (newValues, oldValues) {
            if (newValues !== oldValues) {
                self.updateVisibleTasks();
            }
        });
        this.gantt.$scope.$watchGroup(['filterRow', 'filterRowComparator'], function (newValues, oldValues) {
            if (newValues !== oldValues) {
                self.updateVisibleRows();
            }
        });
        this.gantt.$scope.$watch('sortMode', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.sortRows();
            }
        });

        var _oldVScrollbarVisible = this.gantt.scroll.isVScrollbarVisible();
        this.gantt.$scope.$watchGroup(['maxHeight', 'gantt.rowsManager.visibleRows.length'], function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $timeout(function () {
                    var newVScrollbarVisible = self.gantt.scroll.isVScrollbarVisible();
                    if (newVScrollbarVisible !== _oldVScrollbarVisible) {
                        _oldVScrollbarVisible = newVScrollbarVisible;
                        self.gantt.columnsManager.updateColumnsMeta();
                    }
                });
            }
        });
        this.gantt.api.registerMethod('rows', 'sort', RowsManager.prototype.sortRows, this);
        this.gantt.api.registerMethod('rows', 'applySort', RowsManager.prototype.applySort, this);
        this.gantt.api.registerMethod('rows', 'refresh', RowsManager.prototype.updateVisibleObjects, this);
        this.gantt.api.registerMethod('rows', 'removeRowSorter', RowsManager.prototype.removeCustomRowSorter, this);
        this.gantt.api.registerMethod('rows', 'addRowSorter', RowsManager.prototype.addCustomRowSorter, this);
        this.gantt.api.registerMethod('rows', 'removeRowFilter', RowsManager.prototype.removeCustomRowFilter, this);
        this.gantt.api.registerMethod('rows', 'addRowFilter', RowsManager.prototype.addCustomRowFilter, this);
        this.gantt.api.registerMethod('rows', 'setFilterImpl', RowsManager.prototype.setFilterImpl, this);
        this.gantt.api.registerEvent('tasks', 'add');
        this.gantt.api.registerEvent('tasks', 'change');
        this.gantt.api.registerEvent('tasks', 'viewChange');
        this.gantt.api.registerEvent('tasks', 'beforeRowChange');
        this.gantt.api.registerEvent('tasks', 'beforeViewRowChange');
        this.gantt.api.registerEvent('tasks', 'rowChange');
        this.gantt.api.registerEvent('tasks', 'viewRowChange');
        this.gantt.api.registerEvent('tasks', 'remove');
        this.gantt.api.registerEvent('tasks', 'filter');
        this.gantt.api.registerEvent('tasks', 'displayed');
        this.gantt.api.registerEvent('rows', 'add');
        this.gantt.api.registerEvent('rows', 'change');
        this.gantt.api.registerEvent('rows', 'remove');
        this.gantt.api.registerEvent('rows', 'move');
        this.gantt.api.registerEvent('rows', 'displayed');
        this.gantt.api.registerEvent('rows', 'filter');
        this.updateVisibleObjects();
    };
    RowsManager.prototype.resetNonModelLists = function () {
        this.rows = [];
        this.sortedRows = [];
        this.filteredRows = [];
        this.customFilteredRows = [];
        this.visibleRows = [];
    };
    RowsManager.prototype.addRow = function (rowModel, modelOrderChanged) {
        var row = void 0;
        var i = void 0;
        var l = void 0;
        var isUpdate = false;
        this.gantt.objectModel.cleanRow(rowModel);
        if (rowModel.id in this.rowsMap) {
            row = this.rowsMap[rowModel.id];
            if (modelOrderChanged) {
                this.rows.push(row);
                this.sortedRows.push(row);
                this.filteredRows.push(row);
                this.customFilteredRows.push(row);
                this.visibleRows.push(row);
            }
            if (row.model === rowModel) {
                return;
            }
            var toRemoveIds = ganttArrays.getRemovedIds(rowModel.tasks, row.model.tasks);
            for (i = 0, l = toRemoveIds.length; i < l; i++) {
                var toRemoveId = toRemoveIds[i];
                row.removeTask(toRemoveId);
            }
            row.model = rowModel;
            isUpdate = true;
        } else {
            row = new GanttRow(this, rowModel);
            this.rowsMap[rowModel.id] = row;
            this.rows.push(row);
            this.sortedRows.push(row);
            this.filteredRows.push(row);
            this.customFilteredRows.push(row);
            this.visibleRows.push(row);
        }
        if (rowModel.tasks !== undefined && rowModel.tasks.length > 0) {
            for (i = 0, l = rowModel.tasks.length; i < l; i++) {
                var taskModel = rowModel.tasks[i];
                row.addTask(taskModel);
            }
            row.updateVisibleTasks();
        }
        if (isUpdate) {
            this.gantt.api.rows.raise.change(row);
        } else {
            this.gantt.api.rows.raise.add(row);
        }
        if (!isUpdate) {
            var watcher = this.gantt.$scope.$watchCollection(function () {
                return rowModel.tasks;
            }, function (newTasks, oldTasks) {
                if (newTasks !== oldTasks) {
                    var _i = void 0;
                    var _l = void 0;
                    var _toRemoveIds = ganttArrays.getRemovedIds(newTasks, oldTasks);
                    for (_i = 0, _l = _toRemoveIds.length; _i < _l; _i++) {
                        var toRemove = _toRemoveIds[_i];
                        row.removeTask(toRemove);
                    }
                    if (newTasks !== undefined) {
                        for (_i = 0, _l = newTasks.length; _i < _l; _i++) {
                            var toAdd = newTasks[_i];
                            row.addTask(toAdd);
                        }
                        row.updateVisibleTasks();
                    }
                }
            });
            this.rowsTaskWatchers.push(watcher);
        }
        return isUpdate;
    };
    RowsManager.prototype.removeRow = function (rowId) {
        if (rowId in this.rowsMap) {
            delete this.rowsMap[rowId];
            var removedRow = void 0;
            var row = void 0;
            var indexOf = ganttArrays.indexOfId(this.rows, rowId, ['model', 'id']);
            if (indexOf > -1) {
                removedRow = this.rows.splice(indexOf, 1)[0];
                var unregisterFunction = this.rowsTaskWatchers.splice(indexOf, 1)[0];
                if (unregisterFunction) {
                    unregisterFunction();
                }
            }
            ganttArrays.removeId(this.sortedRows, rowId, ['model', 'id']);
            ganttArrays.removeId(this.filteredRows, rowId, ['model', 'id']);
            ganttArrays.removeId(this.customFilteredRows, rowId, ['model', 'id']);
            ganttArrays.removeId(this.visibleRows, rowId, ['model', 'id']);
            this.gantt.api.rows.raise.remove(removedRow);
            return row;
        }
        return undefined;
    };
    RowsManager.prototype.removeAll = function () {
        this.rowsMap = {};
        this.rows = [];
        this.sortedRows = [];
        this.filteredRows = [];
        this.customFilteredRows = [];
        this.visibleRows = [];

        for (var i = 0, l = this.rowsTaskWatchers.length; i < l; i++) {
            var unregisterFunction = this.rowsTaskWatchers[i];
            unregisterFunction();
        }
        this.rowsTaskWatchers = [];
    };
    RowsManager.prototype.sortRows = function () {
        var expression = this.gantt.options.value('sortMode');
        if (expression !== undefined) {
            var reverse = false;
            if (_angular2.default.isString(expression) && expression.charAt(0) === '-') {
                reverse = true;
                expression = expression.substr(1);
            }
            var angularOrderBy = $filter('orderBy');
            this.sortedRows = angularOrderBy(this.rows, expression, reverse);
        } else {
            this.sortedRows = this.rows.slice();
        }
        this.sortedRows = this.applyCustomRowSorters(this.sortedRows);
        this.updateVisibleRows();
    };
    RowsManager.prototype.removeCustomRowSorter = function (sorterFunction) {
        var i = this.customRowSorters.indexOf(sorterFunction);
        if (i > -1) {
            this.customRowSorters.splice(i, 1);
        }
    };
    RowsManager.prototype.addCustomRowSorter = function (sorterFunction) {
        this.customRowSorters.push(sorterFunction);
    };
    RowsManager.prototype.applyCustomRowSorters = function (sortedRows) {
        for (var i = 0; i < this.customRowSorters.length; i++) {
            sortedRows = this.customRowSorters[i](sortedRows);
        }
        return sortedRows;
    };

    RowsManager.prototype.applySort = function () {
        var data = this.gantt.$scope.data;
        data.splice(0, data.length);
        var rows = [];
        for (var i = 0, l = this.sortedRows.length; i < l; i++) {
            data.push(this.sortedRows[i].model);
            rows.push(this.sortedRows[i]);
        }
        this.rows = rows;
    };
    RowsManager.prototype.moveRow = function (row, targetRow) {
        var sortMode = this.gantt.options.value('sortMode');
        if (sortMode !== undefined) {
            this.applySort();
            this.gantt.options.set('sortMode', undefined);
        }
        var targetRowIndex = this.rows.indexOf(targetRow);
        var rowIndex = this.rows.indexOf(row);
        if (targetRowIndex > -1 && rowIndex > -1 && targetRowIndex !== rowIndex) {
            ganttArrays.moveToIndex(this.rows, rowIndex, targetRowIndex);
            ganttArrays.moveToIndex(this.rowsTaskWatchers, rowIndex, targetRowIndex);
            ganttArrays.moveToIndex(this.gantt.$scope.data, rowIndex, targetRowIndex);
            this.gantt.api.rows.raise.change(row);
            this.gantt.api.rows.raise.move(row, rowIndex, targetRowIndex);
            this.updateVisibleObjects();
            this.sortRows();
        }
    };
    RowsManager.prototype.updateVisibleObjects = function () {
        this.updateVisibleRows();
        this.updateVisibleTasks();
    };
    RowsManager.prototype.updateVisibleRows = function () {
        var oldFilteredRows = this.filteredRows;
        var filterRow = this.gantt.options.value('filterRow');
        if (filterRow) {
            if ((typeof filterRow === 'undefined' ? 'undefined' : (0, _typeof3.default)(filterRow)) === 'object') {
                filterRow = { model: filterRow };
            }
            var filterRowComparator = this.gantt.options.value('filterRowComparator');
            if (typeof filterRowComparator === 'function') {
                var gantt = this.gantt;
                filterRowComparator = function filterRowComparator(actual, expected) {
                    return gantt.options.value('filterRowComparator')(actual, expected);
                };
            }
            this.filteredRows = this.filterImpl(this.sortedRows, filterRow, filterRowComparator);
        } else {
            this.filteredRows = this.sortedRows.slice(0);
        }
        var raiseEvent = !_angular2.default.equals(oldFilteredRows, this.filteredRows);
        this.customFilteredRows = this.applyCustomRowFilters(this.filteredRows);

        this.visibleRows = this.customFilteredRows;
        this.gantt.api.rows.raise.displayed(this.sortedRows, this.filteredRows, this.visibleRows);
        if (raiseEvent) {
            this.gantt.api.rows.raise.filter(this.sortedRows, this.filteredRows);
        }
    };
    RowsManager.prototype.removeCustomRowFilter = function (filterFunction) {
        var i = this.customRowFilters.indexOf(filterFunction);
        if (i > -1) {
            this.customRowFilters.splice(i, 1);
        }
    };
    RowsManager.prototype.addCustomRowFilter = function (filterFunction) {
        this.customRowFilters.push(filterFunction);
    };
    RowsManager.prototype.applyCustomRowFilters = function (filteredRows) {
        for (var i = 0; i < this.customRowFilters.length; i++) {
            filteredRows = this.customRowFilters[i](filteredRows);
        }
        return filteredRows;
    };
    RowsManager.prototype.setFilterImpl = function (filterImpl) {
        if (!filterImpl) {
            this.filterImpl = this._defaultFilterImpl;
        } else {
            this.filterImpl = filterImpl;
        }
    };
    RowsManager.prototype.updateVisibleTasks = function () {
        var oldFilteredTasks = [];
        var filteredTasks = [];
        var tasks = [];
        var visibleTasks = [];
        for (var i = 0; i < this.rows.length; i++) {
            var row = this.rows[i];
            oldFilteredTasks = oldFilteredTasks.concat(row.filteredTasks);
            row.updateVisibleTasks();
            filteredTasks = filteredTasks.concat(row.filteredTasks);
            visibleTasks = visibleTasks.concat(row.visibleTasks);
            tasks = tasks.concat(row.tasks);
        }
        this.gantt.api.tasks.raise.displayed(tasks, filteredTasks, visibleTasks);
        var filterEvent = !_angular2.default.equals(oldFilteredTasks, filteredTasks);
        if (filterEvent) {
            this.gantt.api.tasks.raise.filter(tasks, filteredTasks, visibleTasks);
        }
    };

    RowsManager.prototype.updateTasksPosAndSize = function () {
        for (var i = 0, l = this.rows.length; i < l; i++) {
            this.rows[i].updateTasksPosAndSize();
        }
    };
    RowsManager.prototype.getExpandedFrom = function (from) {
        from = from ? (0, _moment2.default)(from) : from;
        var minRowFrom = from;
        for (var i = 0; i < this.rows.length; i++) {
            if (minRowFrom === undefined || minRowFrom > this.rows[i].from) {
                minRowFrom = this.rows[i];
            }
        }
        if (minRowFrom && (!from || minRowFrom < from)) {
            return minRowFrom;
        }
        return from;
    };
    RowsManager.prototype.getExpandedTo = function (to) {
        to = to ? (0, _moment2.default)(to) : to;
        var maxRowTo = to;
        for (var i = 0; i < this.rows.length; i++) {
            if (maxRowTo === undefined || maxRowTo < this.rows[i].to) {
                maxRowTo = this.rows[i].to;
            }
        }
        var toDate = this.gantt.options.value('toDate');
        if (maxRowTo && (!toDate || maxRowTo > toDate)) {
            return maxRowTo;
        }
        return to;
    };
    RowsManager.prototype.getDefaultFrom = function () {
        var defaultFrom = void 0;
        for (var i = 0; i < this.rows.length; i++) {
            if (defaultFrom === undefined || this.rows[i].from < defaultFrom) {
                defaultFrom = this.rows[i].from;
            }
        }
        return defaultFrom;
    };
    RowsManager.prototype.getDefaultTo = function () {
        var defaultTo = void 0;
        for (var i = 0; i < this.rows.length; i++) {
            if (defaultTo === undefined || this.rows[i].to > defaultTo) {
                defaultTo = this.rows[i].to;
            }
        }
        return defaultTo;
    };
    return RowsManager;
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var Task = function Task(row, model) {
        this.rowsManager = row.rowsManager;
        this.row = row;
        this.model = model;
        this.truncatedLeft = false;
        this.truncatedRight = false;
    };
    Task.prototype.isMilestone = function () {
        return !this.model.to || this.model.from - this.model.to === 0;
    };
    Task.prototype.isOutOfRange = function () {
        var firstColumn = this.rowsManager.gantt.columnsManager.getFirstColumn();
        var lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();
        return firstColumn === undefined || this.model.to < firstColumn.date || lastColumn === undefined || this.model.from > lastColumn.endDate;
    };

    Task.prototype.updatePosAndSize = function () {
        var oldViewLeft = this.left;
        var oldViewWidth = this.width;
        var oldTruncatedRight = this.truncatedRight;
        var oldTruncatedLeft = this.truncatedLeft;
        if (!this.isMoving && this.isOutOfRange()) {
            this.modelLeft = undefined;
            this.modelWidth = undefined;
        } else {
            this.modelLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
            this.modelWidth = this.rowsManager.gantt.getPositionByDate(this.model.to) - this.modelLeft;
        }
        var lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();
        var maxModelLeft = lastColumn ? lastColumn.left + lastColumn.width : 0;
        var modelLeft = this.modelLeft;
        var modelWidth = this.modelWidth;
        if (this.rowsManager.gantt.options.value('daily')) {
            modelLeft = this.rowsManager.gantt.getPositionByDate((0, _moment2.default)(this.model.from).startOf('day'));
            modelWidth = this.rowsManager.gantt.getPositionByDate((0, _moment2.default)(this.model.to).endOf('day')) - modelLeft;
        }
        var minModelLeft = -modelWidth;
        if (modelLeft < minModelLeft) {
            modelLeft = minModelLeft;
        }
        if (modelLeft > maxModelLeft) {
            modelLeft = maxModelLeft;
        }
        if (modelLeft === undefined || modelWidth === undefined) {
            this.left = undefined;
            this.width = undefined;
        } else {
            this.left = modelLeft;
            this.width = modelWidth;
            if (modelLeft < 0) {
                this.truncatedLeft = true;
                this.truncatedLeftOffset = -modelLeft;
                this.truncatedRight = false;
                this.truncatedRightOffset = undefined;
            } else if (modelWidth + modelLeft > this.rowsManager.gantt.width) {
                this.truncatedRight = true;
                this.truncatedRightOffset = modelWidth + modelLeft - this.rowsManager.gantt.width;
                this.truncatedLeft = false;
                this.truncatedLeftOffset = undefined;
            } else {
                this.truncatedLeft = false;
                this.truncatedLeftOffset = undefined;
                this.truncatedRight = false;
                this.truncatedRightOffset = modelWidth + modelLeft - this.rowsManager.gantt.width;
            }
            if (this.width < 0) {
                this.left = this.left + this.width;
                this.width = -this.width;
            }
        }
        this.updateView();
        if (!this.rowsManager.gantt.isRefreshingColumns && (oldViewLeft !== this.left || oldViewWidth !== this.width || oldTruncatedRight !== this.truncatedRight || oldTruncatedLeft !== this.truncatedLeft)) {
            this.rowsManager.gantt.api.tasks.raise.viewChange(this);
        }
    };
    Task.prototype.updateView = function () {
        if (this.$element) {
            if (this.left === undefined || this.width === undefined) {
                this.$element.css('display', 'none');
            } else {
                this.$element.css({ 'left': this.left + 'px', 'width': this.width + 'px', 'display': '' });
                if (this.model.priority > 0) {
                    var priority = this.model.priority;
                    var children = this.$element.children();
                    for (var i = 0; i < children.length; i++) {
                        _angular2.default.element(children[i]).css('z-index', priority);
                    }
                }
                this.$element.toggleClass('gantt-task-milestone', this.isMilestone());
            }
        }
    };
    Task.prototype.getBackgroundElement = function () {
        if (this.$element !== undefined) {
            var backgroundElement = this.$element[0].querySelector('.gantt-task-background');
            if (backgroundElement !== undefined) {
                backgroundElement = _angular2.default.element(backgroundElement);
            }
            return backgroundElement;
        }
    };
    Task.prototype.getContentElement = function () {
        if (this.$element !== undefined) {
            var contentElement = this.$element[0].querySelector('.gantt-task-content');
            if (contentElement !== undefined) {
                contentElement = _angular2.default.element(contentElement);
            }
            return contentElement;
        }
    };
    Task.prototype.getForegroundElement = function () {
        if (this.$element !== undefined) {
            var foregroundElement = this.$element[0].querySelector('.gantt-task-foreground');
            if (foregroundElement !== undefined) {
                foregroundElement = _angular2.default.element(foregroundElement);
            }
            return foregroundElement;
        }
    };

    Task.prototype.setFrom = function (x, magnetEnabled) {
        this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
        this.row.setFromTo();
        this.updatePosAndSize();
    };

    Task.prototype.setTo = function (x, magnetEnabled) {
        this.model.to = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
        this.row.setFromTo();
        this.updatePosAndSize();
    };

    Task.prototype.moveTo = function (x, magnetEnabled) {
        var newTaskRight = void 0;
        var newTaskLeft = void 0;
        if (x > this.modelLeft) {
            this.model.to = this.rowsManager.gantt.getDateByPosition(x + this.modelWidth, magnetEnabled);
            newTaskRight = this.rowsManager.gantt.getPositionByDate(this.model.to);
            newTaskLeft = newTaskRight - this.modelWidth;
            this.model.from = this.rowsManager.gantt.getDateByPosition(newTaskLeft, false);
        } else {
            this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
            newTaskLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
            newTaskRight = newTaskLeft + this.modelWidth;
            this.model.to = this.rowsManager.gantt.getDateByPosition(newTaskRight, false);
        }
        this.row.setFromTo();
        this.updatePosAndSize();
    };
    Task.prototype.clone = function () {
        return new Task(this.row, _angular2.default.copy(this.model));
    };
    return Task;
};

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttBodyColumns", "GanttBodyRows", "GanttBodyBackground", "GanttBodyForeground", function (GanttBodyColumns, GanttBodyRows, GanttBodyBackground, GanttBodyForeground) {
    'ngInject';

    var Body = function Body(gantt) {
        this.gantt = gantt;
        this.background = new GanttBodyBackground(this);
        this.foreground = new GanttBodyForeground(this);
        this.columns = new GanttBodyColumns(this);
        this.rows = new GanttBodyRows(this);
    };
    return Body;
}];

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var GanttBodyBackground = function GanttBodyBackground(body) {
        this.body = body;
    };
    return GanttBodyBackground;
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var BodyColumns = function BodyColumns(body) {
        this.body = body;
    };
    return BodyColumns;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var GanttBodyForeground = function GanttBodyForeground(body) {
        this.body = body;
    };
    return GanttBodyForeground;
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var BodyRows = function BodyRows(body) {
        this.body = body;
    };
    return BodyRows;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttHeaderColumns", function (GanttHeaderColumns) {
    'ngInject';

    var Header = function Header(gantt) {
        this.gantt = gantt;
        this.columns = new GanttHeaderColumns(this);
        this.getHeight = function () {
            return this.$element[0].offsetHeight;
        };
    };
    return Header;
}];

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var HeaderColumns = function HeaderColumns($element) {
        this.$element = $element;
    };
    return HeaderColumns;
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var Scroll = function Scroll(gantt) {
        this.gantt = gantt;
        this.gantt.api.registerEvent('scroll', 'scroll');
        this.gantt.api.registerMethod('scroll', 'to', Scroll.prototype.scrollTo, this);
        this.gantt.api.registerMethod('scroll', 'toDate', Scroll.prototype.scrollToDate, this);
        this.gantt.api.registerMethod('scroll', 'left', Scroll.prototype.scrollToLeft, this);
        this.gantt.api.registerMethod('scroll', 'right', Scroll.prototype.scrollToRight, this);
        this.gantt.api.registerMethod('scroll', 'setWidth', Scroll.prototype.setWidth, this);
    };
    Scroll.prototype.getScrollLeft = function () {
        if (this.$element === undefined) {
            return undefined;
        } else {
            if (this.cachedScrollLeft === undefined) {
                this.cachedScrollLeft = this.$element[0].scrollLeft;
            }
            return this.cachedScrollLeft;
        }
    };
    Scroll.prototype.getScrollWidth = function () {
        return this.$element === undefined ? undefined : this.$element[0].scrollWidth;
    };
    Scroll.prototype.getWidth = function () {
        return this.$element === undefined ? undefined : this.$element[0].offsetWidth;
    };
    Scroll.prototype.setWidth = function (width) {
        if (this.$element[0]) {
            this.$element[0].offsetWidth = width;
        }
    };
    Scroll.prototype.getBordersWidth = function () {
        if (this.$element === undefined) {
            return undefined;
        }
        if (this.$element[0].clientWidth) {
            return this.$element[0].offsetWidth - this.$element[0].clientWidth;
        } else {
            var borderLeft = window.getComputedStyle(this.$element[0]).getPropertyValue('border-left-width') ? window.getComputedStyle(this.$element[0]).getPropertyValue('border-left-width').match(/\d+/)[0] : '0';
            var borderRight = window.getComputedStyle(this.$element[0]).getPropertyValue('border-right-width') ? window.getComputedStyle(this.$element[0]).getPropertyValue('border-right-width').match(/\d+/)[0] : '0';
            return parseInt(borderLeft, 10) + parseInt(borderRight, 10);
        }
    };
    Scroll.prototype.getBordersHeight = function () {
        return this.$element === undefined ? undefined : this.$element[0].offsetHeight - this.$element[0].clientHeight;
    };
    Scroll.prototype.isVScrollbarVisible = function () {
        if (this.$element !== undefined) {
            return this.$element[0].scrollHeight > this.$element[0].offsetHeight;
        }
    };
    Scroll.prototype.isHScrollbarVisible = function () {
        if (this.$element !== undefined) {
            return this.$element[0].scrollWidth > this.$element[0].offsetWidth;
        }
    };

    Scroll.prototype.scrollTo = function (position) {
        this.$element[0].scrollLeft = position;
        this.$element.triggerHandler('scroll');
    };

    Scroll.prototype.scrollToLeft = function (offset) {
        this.$element[0].scrollLeft -= offset;
        this.$element.triggerHandler('scroll');
    };

    Scroll.prototype.scrollToRight = function (offset) {
        this.$element[0].scrollLeft += offset;
        this.$element.triggerHandler('scroll');
    };

    Scroll.prototype.scrollToDate = function (date) {
        var position = this.gantt.getPositionByDate(date);
        if (position !== undefined) {
            this.$element[0].scrollLeft = position - this.$element[0].offsetWidth / 2;
        }
    };
    return Scroll;
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var Side = function Side(gantt) {
        this.gantt = gantt;
    };
    Side.prototype.getWidth = function () {
        if (this.gantt.options.value('showSide')) {
            var width = this.gantt.options.value('sideWidth');
            if (width === undefined && this.$element !== undefined) {
                if (this.$element.css('width') !== undefined) {
                    this.$element.css('width', '');
                }
            }
            if (this.$element !== undefined) {
                width = this.$element[0].offsetWidth;
            }
            if (width !== undefined) {
                return width;
            }
        }
        return 0;
    };
    Side.prototype.show = function (value) {
        if (this.$element !== undefined) {
            this.$element.toggleClass('ng-hide', !value);
        }
    };
    Side.prototype.isShown = function () {
        if (this.$element !== undefined) {
            return !this.$element.hasClass('ng-hide');
        }
    };
    return Side;
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var Timespan = function Timespan(gantt, model) {
        this.gantt = gantt;
        this.model = model;
    };

    Timespan.prototype.updatePosAndSize = function () {
        this.modelLeft = this.gantt.getPositionByDate(this.model.from);
        this.modelWidth = this.gantt.getPositionByDate(this.model.to) - this.modelLeft;
        var lastColumn = this.gantt.columnsManager.getLastColumn();
        var maxModelLeft = lastColumn ? lastColumn.left + lastColumn.width : 0;
        var modelLeft = this.modelLeft;
        var modelWidth = this.modelWidth;
        var minModelLeft = -modelWidth;
        if (modelLeft < minModelLeft) {
            modelLeft = minModelLeft;
        }
        if (modelLeft > maxModelLeft) {
            modelLeft = maxModelLeft;
        }
        if (modelLeft === undefined || modelWidth === undefined) {
            this.left = undefined;
            this.width = undefined;
        } else {
            this.left = modelLeft;
            this.width = modelWidth;
            if (modelLeft < 0) {
                this.truncatedLeft = true;
                this.truncatedLeftOffset = -modelLeft;
                this.truncatedRight = false;
                this.truncatedRightOffset = undefined;
            } else if (modelWidth + modelLeft > this.gantt.width) {
                this.truncatedRight = true;
                this.truncatedRightOffset = modelWidth + modelLeft - this.gantt.width;
                this.truncatedLeft = false;
                this.truncatedLeftOffset = undefined;
            } else {
                this.truncatedLeft = false;
                this.truncatedLeftOffset = undefined;
                this.truncatedRight = false;
                this.truncatedRightOffset = modelWidth + modelLeft - this.gantt.width;
            }
            if (this.width < 0) {
                this.left = this.left + this.width;
                this.width = -this.width;
            }
        }
        this.updateView();
    };
    Timespan.prototype.updateView = function () {
        if (this.$element) {
            if (this.left === undefined || this.width === undefined) {
                this.$element.css('display', 'none');
            } else {
                this.$element.css('display', '');
                this.$element.css('left', this.left + 'px');
                this.$element.css('width', this.width + 'px');
            }
        }
    };

    Timespan.prototype.setFrom = function (x) {
        this.from = this.gantt.getDateByPosition(x);
        this.updatePosAndSize();
    };

    Timespan.prototype.setTo = function (x) {
        this.to = this.gantt.getDateByPosition(x);
        this.updatePosAndSize();
    };

    Timespan.prototype.moveTo = function (x) {
        this.from = this.gantt.getDateByPosition(x);
        this.to = this.gantt.getDateByPosition(x + this.width);
        this.updatePosAndSize();
    };
    Timespan.prototype.clone = function () {
        return new Timespan(this.gantt, _angular2.default.copy(this.model));
    };
    return Timespan;
};

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttTimespan", function (GanttTimespan) {
    'ngInject';

    var GanttTimespansManager = function GanttTimespansManager(gantt) {
        var self = this;
        this.gantt = gantt;
        this.timespansMap = {};
        this.timespans = [];
        this.gantt.$scope.$watchCollection('timespans', function (newValue) {
            self.clearTimespans();
            self.loadTimespans(newValue);
        });
        this.gantt.api.registerMethod('timespans', 'load', this.loadTimespans, this);
        this.gantt.api.registerMethod('timespans', 'remove', this.removeTimespans, this);
        this.gantt.api.registerMethod('timespans', 'clear', this.clearTimespans, this);
        this.gantt.api.registerEvent('timespans', 'add');
        this.gantt.api.registerEvent('timespans', 'remove');
        this.gantt.api.registerEvent('timespans', 'change');
    };

    GanttTimespansManager.prototype.loadTimespans = function (timespans) {
        if (!_angular2.default.isArray(timespans)) {
            timespans = timespans !== undefined ? [timespans] : [];
        }
        this.gantt.$scope.timespans = timespans;

        for (var i = 0, l = timespans.length; i < l; i++) {
            var timespanModel = timespans[i];
            this.gantt.objectModel.cleanTimespan(timespanModel);
            this.loadTimespan(timespanModel);
        }
    };

    GanttTimespansManager.prototype.loadTimespan = function (timespanModel) {
        var timespan = void 0;
        var isUpdate = false;
        if (timespanModel.id in this.timespansMap) {
            timespan = this.timespansMap[timespanModel.id];
            timespan.model = timespanModel;
            isUpdate = true;
            this.gantt.api.timespans.raise.change(timespan);
        } else {
            timespan = new GanttTimespan(this.gantt, timespanModel);
            this.timespansMap[timespanModel.id] = timespan;
            this.timespans.push(timespan);
            this.gantt.api.timespans.raise.add(timespan);
        }
        timespan.updatePosAndSize();
        return isUpdate;
    };
    GanttTimespansManager.prototype.removeTimespans = function (timespans) {
        if (!_angular2.default.isArray(timespans)) {
            timespans = [timespans];
        }
        for (var i = 0, l = timespans.length; i < l; i++) {
            var timespanData = timespans[i];

            this.removeTimespan(timespanData.id);
        }
        this.updateVisibleObjects();
    };
    GanttTimespansManager.prototype.removeTimespan = function (timespanId) {
        if (timespanId in this.timespansMap) {
            delete this.timespansMap[timespanId];
            var removedTimespan = void 0;
            var timespan = void 0;
            for (var i = this.timespans.length - 1; i >= 0; i--) {
                timespan = this.timespans[i];
                if (timespan.model.id === timespanId) {
                    removedTimespan = timespan;
                    this.timespans.splice(i, 1);
                    break;
                }
            }
            this.gantt.api.timespans.raise.remove(removedTimespan);
            return removedTimespan;
        }
        return undefined;
    };

    GanttTimespansManager.prototype.clearTimespans = function () {
        this.timespansMap = {};
        this.timespans = [];
    };
    GanttTimespansManager.prototype.updateTimespansPosAndSize = function () {
        for (var i = 0, l = this.timespans.length; i < l; i++) {
            this.timespans[i].updatePosAndSize();
        }
    };
    return GanttTimespansManager;
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        moveToIndex: function moveToIndex(array, oldIndex, newIndex) {
            if (newIndex >= array.length) {
                var k = newIndex - array.length;
                while (k-- + 1) {
                    array.push(undefined);
                }
            }
            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
            return array;
        },
        getRemovedIds: function getRemovedIds(newArray, oldArray, idProperty) {
            if (idProperty === undefined) {
                idProperty = 'id';
            }
            var i = void 0;
            var l = void 0;
            var removedIds = [];
            if (oldArray !== undefined) {
                for (i = 0, l = oldArray.length; i < l; i++) {
                    removedIds.push(oldArray[i][idProperty]);
                }
            }
            if (newArray !== undefined) {
                for (i = 0, l = newArray.length; i < l; i++) {
                    var newObject = newArray[i];
                    if (newObject[idProperty] !== undefined) {
                        var newObjectIndex = removedIds.indexOf(newObject[idProperty]);
                        if (newObjectIndex > -1) {
                            removedIds.splice(newObjectIndex, 1);
                        }
                    }
                }
            }
            return removedIds;
        },
        indexOfId: function indexOfId(array, value, idProperties) {
            var i = void 0;
            if (idProperties === undefined) {
                idProperties = 'id';
            } else if (idProperties instanceof Array) {
                for (i = array.length - 1; i >= 0; i--) {
                    var arrayValue = array[i];

                    for (var k = 0, l = idProperties.length; k < l; k++) {
                        arrayValue = arrayValue[idProperties[k]];
                    }
                    if (arrayValue === value) {
                        return i;
                    }
                }
                return -1;
            }
            for (i = array.length - 1; i >= 0; i--) {
                if (array[i][idProperties] === value) {
                    return i;
                }
            }
            return -1;
        },
        removeId: function removeId(array, value, idProperties) {
            var indexOf = this.indexOfId(array, value, idProperties);
            if (indexOf > -1) {
                return array.splice(indexOf, 1)[0];
            }
        },
        remove: function remove(array, value) {
            var index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
                return true;
            }
            return false;
        }
    };
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        getIndicesOnly: function getIndicesOnly(input, value, comparer, strict) {
            var lo = -1;
            var hi = input.length;
            while (hi - lo > 1) {
                var mid = Math.floor((lo + hi) / 2);
                if (strict ? comparer(input[mid]) < value : comparer(input[mid]) <= value) {
                    lo = mid;
                } else {
                    hi = mid;
                }
            }
            if (!strict && input[lo] !== undefined && comparer(input[lo]) === value) {
                hi = lo;
            }
            return [lo, hi];
        },
        get: function get(input, value, comparer, strict) {
            var res = this.getIndicesOnly(input, value, comparer, strict);
            return [input[res[0]], input[res[1]]];
        }
    };
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    var Hierarchy = function Hierarchy() {
        var self = this;
        var nameToRow = {};
        var idToRow = {};
        var nameToChildren = {};
        var idToChildren = {};
        var nameToParent = {};
        var idToParent = {};
        var registerChildRow = function registerChildRow(row, childRow) {
            if (childRow !== undefined) {
                var nameChildren = nameToChildren[row.model.name];
                if (nameChildren === undefined) {
                    nameChildren = [];
                    nameToChildren[row.model.name] = nameChildren;
                }
                nameChildren.push(childRow);
                var idChildren = idToChildren[row.model.id];
                if (idChildren === undefined) {
                    idChildren = [];
                    idToChildren[row.model.id] = idChildren;
                }
                idChildren.push(childRow);
                nameToParent[childRow.model.name] = row;
                idToParent[childRow.model.id] = row;
            }
        };
        this.refresh = function (rows) {
            nameToRow = {};
            idToRow = {};
            nameToChildren = {};
            idToChildren = {};
            nameToParent = {};
            idToParent = {};
            var row = void 0;
            for (var i = 0; i < rows.length; i++) {
                row = rows[i];
                nameToRow[row.model.name] = row;
                idToRow[row.model.id] = row;
            }
            for (var _i = 0; _i < rows.length; _i++) {
                row = rows[_i];
                if (row.model.parent !== undefined) {
                    var parentRow = nameToRow[row.model.parent];
                    if (parentRow === undefined) {
                        parentRow = idToRow[row.model.parent];
                    }
                    if (parentRow !== undefined) {
                        registerChildRow(parentRow, row);
                    }
                }
                if (row.model.children !== undefined) {
                    var children = row.model.children;
                    for (var j = 0; j < children.length; j++) {
                        var childRowNameOrId = children[j];
                        var childRow = nameToRow[childRowNameOrId];
                        if (childRow === undefined) {
                            childRow = idToRow[childRowNameOrId];
                        }
                        if (childRow !== undefined) {
                            registerChildRow(row, childRow);
                        }
                    }
                }
            }
            var rootRows = [];
            for (var _i2 = 0; _i2 < rows.length; _i2++) {
                row = rows[_i2];
                if (self.parent(row) === undefined) {
                    rootRows.push(row);
                }
            }
            return rootRows;
        };
        this.children = function (row) {
            var children = idToChildren[row.model.id];
            return children;
        };
        this.descendants = function (row) {
            var descendants = [];
            var children = self.children(row);
            descendants.push.apply(descendants, children);
            if (children !== undefined) {
                for (var i = 0; i < children.length; i++) {
                    var childDescendants = self.descendants(children[i]);
                    descendants.push.apply(descendants, childDescendants);
                }
            }
            return descendants;
        };
        this.parent = function (row) {
            var parent = idToParent[row.model.id];
            return parent;
        };
        this.ancestors = function (row) {
            var ancestors = [];
            var parent = self.parent(row);
            while (parent !== undefined) {
                ancestors.push(parent);
                parent = self.parent(parent);
            }
            return ancestors;
        };
    };
    return Hierarchy;
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        createBoundedWrapper: function createBoundedWrapper(object, method) {
            return function () {
                return method.apply(object, arguments);
            };
        },
        firstProperty: function firstProperty(objects, propertyName, defaultValue) {
            for (var i = 0, l = objects.length; i < l; i++) {
                var object = objects[i];
                if (object !== undefined && propertyName in object) {
                    if (object[propertyName] !== undefined) {
                        return object[propertyName];
                    }
                }
            }
            return defaultValue;
        },
        angularIndexOf: function angularIndexOf(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (_angular2.default.equals(arr[i], obj)) {
                    return i;
                }
            }
            return -1;
        },
        random4: function random4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        },
        randomUuid: function randomUuid() {
            return this.random4() + this.random4() + '-' + this.random4() + '-' + this.random4() + '-' + this.random4() + '-' + this.random4() + this.random4() + this.random4();
        },
        newId: function () {
            var seedId = new Date().getTime();
            return function () {
                return seedId += 1;
            };
        }()
    };
};

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["ganttBinarySearch", function (ganttBinarySearch) {
    'ngInject';

    var leftComparator = function leftComparator(c) {
        return c.left;
    };
    return function (input, gantt) {
        var scrollLeft = gantt.scroll.getScrollLeft();
        var scrollContainerWidth = gantt.getWidth() - gantt.side.getWidth();
        if (scrollContainerWidth > 0) {
            var start = ganttBinarySearch.getIndicesOnly(input, scrollLeft, leftComparator)[0];
            var end = ganttBinarySearch.getIndicesOnly(input, scrollLeft + scrollContainerWidth, leftComparator)[1];
            return input.slice(start, end);
        } else {
            return input.slice();
        }
    };
}];

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return function (input, gantt) {
        var firstColumn = gantt.columnsManager.getFirstColumn();
        var lastColumn = gantt.columnsManager.getLastColumn();
        if (firstColumn !== undefined && lastColumn !== undefined) {
            var fromDate = firstColumn.date;
            var toDate = lastColumn.endDate;
            var res = [];
            var scrollLeft = gantt.scroll.getScrollLeft();
            var scrollContainerWidth = gantt.getWidth() - gantt.side.getWidth();

            for (var i = 0, l = input.length; i < l; i++) {
                var task = input[i];
                if (task.active) {
                    res.push(task);
                } else {
                    if (task.model.to >= fromDate && task.model.from <= toDate) {
                        if (task.left === undefined) {
                            task.updatePosAndSize();
                        }

                        if (!scrollContainerWidth || task.left >= scrollLeft && task.left <= scrollLeft + scrollContainerWidth || task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollContainerWidth || task.left < scrollLeft && task.left + task.width > scrollLeft + scrollContainerWidth) {
                            res.push(task);
                        }
                    }
                }
            }
            return res;
        } else {
            return input.splice();
        }
    };
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$document", "$parse", "$timeout", "ganttMouseOffset", function ($document, $parse, $timeout, ganttMouseOffset) {
    'ngInject';

    return {
        restrict: 'A',
        require: '^gantt',
        scope: {
            targetElement: '=ganttResizer',
            enabled: '@?ganttResizerEnabled'
        },
        link: function link($scope, $element, $attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;
            var eventTopic = $attrs.ganttResizerEventTopic;
            if ($scope.enabled === undefined) {
                $scope.enabled = true;
            }
            function getWidth() {
                return ganttCtrl.gantt.options.value($attrs.resizerWidth);
            }
            function setWidth(width) {
                if (width !== getWidth()) {
                    ganttCtrl.gantt.options.set($attrs.resizerWidth, width);
                    if (eventTopic !== undefined) {
                        api[eventTopic].raise.resize(width);
                    }
                    $timeout(function () {
                        ganttCtrl.gantt.columnsManager.updateColumnsMeta();
                    });
                }
            }
            function dblclick(event) {
                event.preventDefault();
                setWidth(undefined);
            }
            function mousemove(event) {
                $scope.$evalAsync(function () {
                    var offset = ganttMouseOffset.getOffsetForElement($scope.targetElement[0], event);
                    var maxWidth = ganttCtrl.gantt.getWidth() - ganttCtrl.gantt.scroll.getBordersWidth();
                    var width = Math.min(Math.max(offset.x, 0), maxWidth);
                    setWidth(width);
                });
            }
            function mouseup() {
                if (eventTopic !== undefined) {
                    api[eventTopic].raise.resizeEnd(getWidth());
                }
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
            function mousedown(event) {
                event.preventDefault();
                if (eventTopic !== undefined) {
                    api[eventTopic].raise.resizeBegin(getWidth());
                }
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            }
            $attrs.$observe('ganttResizerEnabled', function (value) {
                $scope.enabled = $parse(value)();
            });
            $scope.$watch('enabled', function (value) {
                if (value === undefined) {
                    value = true;
                }
                $element.toggleClass('gantt-resizer-enabled', value);
                if (value) {
                    $element.on('dblclick', dblclick);
                    $element.on('mousedown', mousedown);
                } else {
                    $element.off('dblclick', dblclick);
                    $element.off('mousedown', mousedown);
                }
            });
            $scope.$watch(function () {
                return getWidth();
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.targetElement.css('width', newValue + 'px');

                    if ($scope.targetElement[0].offsetWidth > 0) {
                        setWidth($scope.targetElement[0].offsetWidth);
                    }
                }
            });
            if (eventTopic) {
                api.registerEvent(eventTopic, 'resize');
                api.registerEvent(eventTopic, 'resizeBegin');
                api.registerEvent(eventTopic, 'resizeEnd');
                api.registerMethod(eventTopic, 'setWidth', setWidth, this);
                api.registerMethod(eventTopic, 'getWidth', getWidth, this);
            }
        }
    };
}];

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        require: '^ganttScrollManager',
        link: function link(scope, element, attrs, ganttScrollManagerCtrl) {
            ganttScrollManagerCtrl.registerHorizontalReceiver(element);
        }
    };
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        scope: {},
        controller: ['$scope', function ($scope) {
            $scope.horizontal = [];
            $scope.vertical = [];
            this.registerVerticalReceiver = function (element) {
                element.css('position', 'relative');
                $scope.vertical.push(element[0]);
            };
            this.registerHorizontalReceiver = function (element) {
                element.css('position', 'relative');
                $scope.horizontal.push(element[0]);
            };
            this.getHorizontalRecievers = function () {
                return $scope.horizontal;
            };
            this.getVerticalRecievers = function () {
                return $scope.vertical;
            };
        }]
    };
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        require: ['^gantt', '^ganttScrollManager'],
        link: function link(scope, element, attrs, controllers) {
            var el = element[0];
            var updateListeners = function updateListeners() {
                var i = void 0;
                var l = void 0;
                var vertical = controllers[1].getVerticalRecievers();
                for (i = 0, l = vertical.length; i < l; i++) {
                    var vElement = vertical[i];
                    if (vElement.parentNode.scrollTop !== el.scrollTop) {
                        vElement.parentNode.scrollTop = el.scrollTop;
                    }
                }
                var horizontal = controllers[1].getHorizontalRecievers();
                for (i = 0, l = horizontal.length; i < l; i++) {
                    var hElement = horizontal[i];
                    if (hElement.parentNode.scrollLeft !== el.scrollLeft) {
                        hElement.parentNode.scrollLeft = el.scrollLeft;
                    }
                }
            };
            element.bind('scroll', updateListeners);
            scope.$watch(function () {
                return controllers[0].gantt.width;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var horizontal = controllers[1].getHorizontalRecievers();

                    for (var i = 0, l = horizontal.length; i < l; i++) {
                        var hElement = horizontal[i];
                        hElement.style.width = newValue + 'px';
                    }
                }
            });
        }
    };
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", "$timeout", "ganttDebounce", function (GanttDirectiveBuilder, $timeout, ganttDebounce) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttScrollable');
    builder.controller = function ($scope, $element) {
        $scope.gantt.scroll.$element = $element;
        var lastScrollLeft = void 0;
        var autoExpandTimer = void 0;
        var autoExpandColumns = function autoExpandColumns(el, date, direction) {
            var autoExpand = $scope.gantt.options.value('autoExpand');
            if (autoExpand !== 'both' && autoExpand !== true && autoExpand !== direction) {
                return;
            }
            var from = void 0;
            var to = void 0;
            var viewScale = $scope.gantt.options.value('viewScale');
            viewScale = viewScale.trim();
            if (viewScale.charAt(viewScale.length - 1) === 's') {
                viewScale = viewScale.substring(0, viewScale.length - 1);
            }
            var viewScaleValue = void 0;
            var viewScaleUnit = void 0;
            var splittedViewScale = void 0;
            if (viewScale) {
                splittedViewScale = viewScale.split(' ');
            }
            if (splittedViewScale && splittedViewScale.length > 1) {
                viewScaleValue = parseFloat(splittedViewScale[0]);
                viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
            } else {
                viewScaleValue = 1;
                viewScaleUnit = viewScale;
            }
            if (direction === 'left') {
                from = (0, _moment2.default)(date).add(-5 * viewScaleValue, viewScaleUnit);
                $scope.fromDate = from;
            } else {
                to = (0, _moment2.default)(date).add(5 * viewScaleValue, viewScaleUnit);
                $scope.toDate = to;
            }
            $scope.gantt.api.scroll.raise.scroll(el.scrollLeft, date, direction);
        };
        $element.bind('scroll', ganttDebounce(function () {
            var el = $element[0];
            var currentScrollLeft = el.scrollLeft;
            var direction = void 0;
            var date = void 0;
            $scope.gantt.scroll.cachedScrollLeft = currentScrollLeft;
            $scope.gantt.columnsManager.updateVisibleColumns();
            $scope.gantt.rowsManager.updateVisibleObjects();
            if (currentScrollLeft < lastScrollLeft && currentScrollLeft === 0) {
                direction = 'left';
                date = $scope.gantt.columnsManager.from;
            } else if (currentScrollLeft > lastScrollLeft && el.offsetWidth + currentScrollLeft >= el.scrollWidth - 1) {
                direction = 'right';
                date = $scope.gantt.columnsManager.to;
            }
            lastScrollLeft = currentScrollLeft;
            if (date !== undefined) {
                if (autoExpandTimer) {
                    $timeout.cancel(autoExpandTimer);
                }
                autoExpandTimer = $timeout(function () {
                    autoExpandColumns(el, date, direction);
                }, 300);
            } else {
                $scope.gantt.api.scroll.raise.scroll(currentScrollLeft);
            }
        }, 5));
        $scope.getScrollableCss = function () {
            var css = {};
            var maxHeight = $scope.gantt.options.value('maxHeight');
            if (!maxHeight) {
                maxHeight = $scope.gantt.getContainerHeight();
            }
            if (maxHeight > 0) {
                css['max-height'] = maxHeight - $scope.gantt.header.getHeight() + 'px';
                css['overflow-y'] = 'auto';
                if ($scope.gantt.scroll.isVScrollbarVisible()) {
                    css['border-right'] = 'none';
                }
            }
            var columnWidth = this.gantt.options.value('columnWidth');
            var bodySmallerThanGantt = $scope.gantt.width === 0 ? false : $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth();
            if (columnWidth !== undefined && bodySmallerThanGantt) {
                css['width'] = $scope.gantt.width + this.gantt.scroll.getBordersWidth() + 'px';
            }
            return css;
        };
    };
    return builder.build();
}];

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        require: '^ganttScrollManager',
        link: function link(scope, element, attrs, ganttScrollManagerCtrl) {
            ganttScrollManagerCtrl.registerVerticalReceiver(element);
        }
    };
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var scopeVariable = $attrs.ganttContainerHeightListener;
            if (scopeVariable === '') {
                scopeVariable = 'ganttContainerHeight';
            }
            var effectiveScope = $scope;
            while (scopeVariable.indexOf('$parent.') === 0) {
                scopeVariable = scopeVariable.substring('$parent.'.length);
                effectiveScope = effectiveScope.$parent;
            }
            effectiveScope.$watch(function () {
                var el = $element[0].parentElement ? $element[0].parentElement.parentElement : undefined;
                if (el) {
                    var height = el.offsetHeight;
                    var style = getComputedStyle(el);
                    height = height - parseInt(style.marginTop, 10) - parseInt(style.marginBottom, 10);
                    return height;
                }
                return 0;
            }, function (newValue) {
                if (newValue > 0) {
                    effectiveScope[scopeVariable] = newValue;
                }
            });
        }]
    };
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var scopeVariable = $attrs.ganttContainerWidthListener;
            if (scopeVariable === '') {
                scopeVariable = 'ganttContainerWidth';
            }
            var effectiveScope = $scope;
            while (scopeVariable.indexOf('$parent.') === 0) {
                scopeVariable = scopeVariable.substring('$parent.'.length);
                effectiveScope = effectiveScope.$parent;
            }
            effectiveScope.$watch(function () {
                var el = $element[0].parentElement ? $element[0].parentElement.parentElement : undefined;
                if (el) {
                    var width = el.offsetWidth;
                    var style = getComputedStyle(el);
                    width = width - parseInt(style.marginLeft, 10) - parseInt(style.marginRight, 10);
                    return width;
                }
                return 0;
            }, function (newValue) {
                if (newValue > 0) {
                    effectiveScope[scopeVariable] = newValue;
                }
            });
        }]
    };
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var scopeVariable = $attrs.ganttElementHeightListener;
            if (scopeVariable === '') {
                scopeVariable = 'ganttElementHeight';
            }
            var el = $element[0];
            var effectiveScope = $scope;
            while (scopeVariable.indexOf('$parent.') === 0) {
                scopeVariable = scopeVariable.substring('$parent.'.length);
                effectiveScope = effectiveScope.$parent;
            }
            effectiveScope.$watch(function () {
                return el.clientHeight;
            }, function (newValue) {
                if (newValue > 0) {
                    effectiveScope[scopeVariable] = newValue;
                }
            });
        }]
    };
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var scopeVariable = $attrs.ganttElementWidthListener;
            if (scopeVariable === '') {
                scopeVariable = 'ganttElementWidth';
            }
            var el = $element[0];
            var effectiveScope = $scope;
            while (scopeVariable.indexOf('$parent.') === 0) {
                scopeVariable = scopeVariable.substring('$parent.'.length);
                effectiveScope = effectiveScope.$parent;
            }
            effectiveScope.$watch(function () {
                return el.clientWidth;
            }, function (newValue) {
                if (newValue > 0) {
                    effectiveScope[scopeVariable] = newValue;
                }
            });
        }]
    };
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttBody');
    builder.controller = function ($scope, $element) {
        $scope.gantt.body.$element = $element;
        $scope.gantt.body.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttBodyBackground');
    builder.controller = function ($scope, $element) {
        $scope.gantt.body.background.$element = $element;
        $scope.gantt.body.background.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttBodyColumns');
    builder.controller = function ($scope, $element) {
        $scope.gantt.body.columns.$element = $element;
        $scope.gantt.body.background.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttBodyForeground');
    builder.controller = function ($scope, $element) {
        $scope.gantt.body.foreground.$element = $element;
        $scope.gantt.body.foreground.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttBodyRows');
    builder.controller = function ($scope, $element) {
        $scope.gantt.body.rows.$element = $element;
        $scope.gantt.body.rows.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttColumn');
    builder.controller = function ($scope, $element) {
        $scope.column.$element = $element;
        $scope.column.$scope = $scope;
        $scope.column.updateView();
    };
    return builder.build();
}];

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttColumnHeader');
    builder.controller = function ($scope, $element) {
        $scope.column.$element = $element;
        $scope.column.$scope = $scope;
        $scope.column.updateView();
    };
    return builder.build();
}];

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttHeader');
    builder.controller = function ($scope, $element) {
        $scope.gantt.header.$element = $element;
        $scope.gantt.header.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttHeaderColumns');
    builder.controller = function ($scope, $element) {
        $scope.gantt.header.columns.$element = $element;
        $scope.gantt.header.columns.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttRow');
    builder.controller = function ($scope, $element) {
        $scope.row.$element = $element;
        $scope.row.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttRowBackground');
    return builder.build();
}];

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttRowLabel');
    builder.restrict = 'A';
    builder.templateUrl = undefined;
    return builder.build();
}];

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", "ganttLayout", function (GanttDirectiveBuilder, ganttLayout) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttScrollableHeader');
    builder.controller = function ($scope) {
        var scrollBarWidth = ganttLayout.getScrollBarWidth();
        $scope.getScrollableHeaderCss = function () {
            var css = {};
            var maxHeightActivated = $scope.gantt.scroll.isVScrollbarVisible();
            var vScrollbarWidth = maxHeightActivated ? scrollBarWidth : 0;
            var columnWidth = this.gantt.options.value('columnWidth');
            var bodySmallerThanGantt = $scope.gantt.width === 0 ? false : $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth();
            if (columnWidth !== undefined && bodySmallerThanGantt) {
                css['width'] = $scope.gantt.width - vScrollbarWidth + this.gantt.scroll.getBordersWidth() + 'px';
            } else if (maxHeightActivated) {
                css['width'] = $scope.gantt.getWidth() - $scope.gantt.side.getWidth() - vScrollbarWidth + 'px';
            }

            return css;
        };
    };
    return builder.build();
}];

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttSide');
    builder.controller = function ($scope, $element) {
        $scope.gantt.side.$element = $element;
        $scope.gantt.side.$scope = $scope;
    };
    return builder.build();
}];

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", "ganttLayout", function (GanttDirectiveBuilder, ganttLayout) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttSideBackground');
    builder.controller = function ($scope) {
        var hScrollBarHeight = ganttLayout.getScrollBarHeight();
        $scope.getMaxHeightCss = function () {
            var css = {};
            var maxHeight = $scope.maxHeight;
            if (!maxHeight) {
                maxHeight = $scope.gantt.getContainerHeight();
            }
            var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
            css['max-height'] = maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';
            return css;
        };
    };
    return builder.build();
}];

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttSideContent');
    return builder.build();
}];

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttTask');
    builder.controller = function ($scope, $element) {
        $scope.task.$element = $element;
        $scope.task.$scope = $scope;
        $scope.getTaskContent = function () {
            if ($scope.task.model.content !== undefined) {
                return $scope.task.model.content;
            }
            return $scope.task.rowsManager.gantt.options.value('taskContent');
        };
        $scope.simplifyMoment = function (d) {
            return _moment2.default.isMoment(d) ? d.unix() : d;
        };
        $scope.$watchGroup(['simplifyMoment(task.model.from)', 'simplifyMoment(task.model.to)'], function () {
            $scope.task.updatePosAndSize();
        });
    };
    return builder.build();
}];

var _moment = __webpack_require__(1);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttTaskBackground');
    return builder.build();
}];

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttTaskContent');
    return builder.build();
}];

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttTaskForeground');
    return builder.build();
}];

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttTimeFrame');
    builder.controller = function ($scope, $element) {
        $scope.timeFrame.$element = $element;
        $scope.timeFrame.$scope = $scope;
        $scope.timeFrame.updateView();
    };
    return builder.build();
}];

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["GanttDirectiveBuilder", function (GanttDirectiveBuilder) {
    'ngInject';

    var builder = new GanttDirectiveBuilder('ganttTimespan');
    builder.controller = function ($scope, $element) {
        $scope.timespan.$element = $element;
        $scope.timespan.$scope = $scope;
        $scope.timespan.updateView();
    };
    return builder.build();
}];

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$timeout", function ($timeout) {
    'ngInject';

    function debounce(fn, timeout, invokeApply) {
        var nthCall = 0;
        return function () {
            var self = this;
            var argz = arguments;
            nthCall++;
            var later = function (version) {
                return function () {
                    if (version === nthCall) {
                        return fn.apply(self, argz);
                    }
                };
            }(nthCall);
            return $timeout(later, timeout, invokeApply === undefined ? true : invokeApply);
        };
    }
    return debounce;
}];

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$templateCache", function ($templateCache) {
    'ngInject';

    var DirectiveBuilder = function DirectiveBuilder(directiveName, templateUrl, require, restrict) {
        var self = this;
        this.directiveName = directiveName;
        this.templateUrl = templateUrl === undefined ? 'template/' + directiveName + '.tmpl.html' : templateUrl;
        this.require = require === undefined ? '^gantt' : require;
        this.restrict = restrict === undefined ? 'E' : restrict;
        this.scope = false;
        this.transclude = true;
        this.replace = true;
        this.build = function () {
            var directiveName = self.directiveName;
            var _templateUrl = self.templateUrl;
            var controllerFunction = self.controller;
            var directive = {
                restrict: self.restrict,
                require: self.require,
                transclude: self.transclude,
                replace: self.replace,
                scope: self.scope,
                templateUrl: function templateUrl(tElement, tAttrs) {
                    if (tAttrs.templateUrl !== undefined) {
                        _templateUrl = tAttrs.templateUrl;
                    }
                    if (tAttrs.template !== undefined) {
                        $templateCache.put(_templateUrl, tAttrs.template);
                    }
                    return _templateUrl;
                },
                compile: function compile() {
                    return {
                        pre: function preLink(scope, iElement, iAttrs, controller) {
                            scope.gantt.api.directives.raise.preLink(directiveName, scope, iElement, iAttrs, controller);
                        },
                        post: function postLink(scope, iElement, iAttrs, controller) {
                            scope.gantt.api.directives.raise.postLink(directiveName, scope, iElement, iAttrs, controller);
                        }
                    };
                },
                controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    var controller = this;
                    if (controllerFunction !== undefined) {
                        controllerFunction($scope, $element, $attrs, controller);
                    }
                    $scope.gantt.api.directives.raise.controller(directiveName, $scope, $element, $attrs, controller);
                    $scope.$on('$destroy', function () {
                        $scope.gantt.api.directives.raise.destroy(directiveName, $scope, $element, $attrs, controller);
                    });
                    $scope.$applyAsync(function () {
                        $scope.gantt.api.directives.raise.new(directiveName, $scope, $element, $attrs, controller);
                    });
                }]
            };
            if (!_templateUrl) {
                delete directive.templateUrl;
                delete directive.replace;
                delete directive.transclude;
            }
            return directive;
        };
    };
    return DirectiveBuilder;
}];

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$document", function ($document) {
    'ngInject';

    return {
        elementFromPoint: function elementFromPoint(x, y) {
            return $document[0].elementFromPoint(x, y);
        },
        elementsFromPoint: function elementsFromPoint(x, y, depth) {
            var elements = [];
            var previousPointerEvents = [];
            var cDepth = 0;
            var current = void 0;
            var i = void 0;
            var l = void 0;
            var d = void 0;

            while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null && (depth === undefined || cDepth < depth)) {
                elements.push(current);
                previousPointerEvents.push({
                    value: current.style.getPropertyValue('visibility'),
                    priority: current.style.getPropertyPriority('visibility')
                });

                current.style.setProperty('visibility', 'hidden', 'important');
                cDepth++;
            }

            for (i = 0, l = previousPointerEvents.length; i < l; i++) {
                d = previousPointerEvents[i];
                elements[i].style.setProperty('visibility', d.value ? d.value : '', d.priority);
            }
            return elements;
        },
        findElementFromPoint: function findElementFromPoint(x, y, checkFunction) {
            var elements = [];
            var previousPointerEvents = [];
            var cDepth = 0;
            var current = void 0;
            var found = void 0;
            var i = void 0;
            var l = void 0;
            var d = void 0;

            while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null) {
                elements.push(current);
                previousPointerEvents.push({
                    value: current.style.getPropertyValue('visibility'),
                    priority: current.style.getPropertyPriority('visibility')
                });

                current.style.setProperty('visibility', 'hidden', 'important');
                cDepth++;
                if (checkFunction(current)) {
                    found = current;
                    break;
                }
            }

            for (i = 0, l = previousPointerEvents.length; i < l; i++) {
                d = previousPointerEvents[i];
                elements[i].style.setProperty('visibility', d.value ? d.value : '', d.priority);
            }
            return found;
        },
        isElementVisible: function isElementVisible(element) {
            return element.offsetParent !== undefined && element.offsetParent !== null;
        }
    };
}];

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$injector", function ($injector) {
    'ngInject';

    var ngAnimate = void 0;
    try {
        ngAnimate = $injector.get('$animate');
    } catch (e) {}
    if (ngAnimate !== undefined) {
        return function (element, enabled) {
            if (_angular2.default.version.major >= 1 && _angular2.default.version.minor >= 4) {
                ngAnimate.enabled(element, enabled);
            } else {
                ngAnimate.enabled(enabled, element);
            }
        };
    } else {
        return _angular2.default.noop;
    }
}];

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$compile", function ($compile) {
    'ngInject';

    return {
        restrict: 'A',
        require: '^gantt',
        link: function link(scope, element, attrs, ganttCtrl) {
            scope.scope = ganttCtrl.gantt.$scope.$parent;
            scope.$watch(function () {
                return scope.$eval(attrs.ganttBindCompileHtml);
            }, function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            });
        }
    };
}];

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = ["$document", function ($document) {
    'ngInject';

    return {
        getScrollBarWidth: function getScrollBarWidth() {
            var inner = $document[0].createElement('p');
            inner.style.width = '100%';
            inner.style.height = '200px';
            var outer = $document[0].createElement('div');
            outer.style.position = 'absolute';
            outer.style.top = '0px';
            outer.style.left = '0px';
            outer.style.visibility = 'hidden';
            outer.style.width = '200px';
            outer.style.height = '150px';
            outer.style.overflow = 'hidden';
            outer.appendChild(inner);
            $document[0].body.appendChild(outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 === w2) {
                w2 = outer.clientWidth;
            }
            $document[0].body.removeChild(outer);
            return w1 - w2;
        },

        getScrollBarHeight: function getScrollBarHeight() {
            var inner = $document[0].createElement('p');
            inner.style.width = '200px;';
            inner.style.height = '100%';
            var outer = $document[0].createElement('div');
            outer.style.position = 'absolute';
            outer.style.top = '0px';
            outer.style.left = '0px';
            outer.style.visibility = 'hidden';
            outer.style.width = '150px';
            outer.style.height = '200px';
            outer.style.overflow = 'hidden';
            outer.appendChild(inner);
            $document[0].body.appendChild(outer);
            var h1 = inner.offsetHeight;
            outer.style.overflow = 'scroll';
            var h2 = inner.offsetHeight;
            if (h1 === h2) {
                h2 = outer.clientHeight;
            }
            $document[0].body.removeChild(outer);
            return h1 - h2;
        },
        setColumnsWidthFactor: function setColumnsWidthFactor(columns, widthFactor, originalLeftOffset) {
            if (!columns) {
                return;
            }
            if (!originalLeftOffset) {
                originalLeftOffset = 0;
            }
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                column.left = widthFactor * (column.originalSize.left + originalLeftOffset) - originalLeftOffset;
                column.width = widthFactor * column.originalSize.width;
                for (var j = 0; j < column.timeFrames.length; j++) {
                    var timeFrame = column.timeFrames[j];
                    timeFrame.left = widthFactor * timeFrame.originalSize.left;
                    timeFrame.width = widthFactor * timeFrame.originalSize.width;
                }
            }
        }
    };
}];

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        getButton: function getButton(e) {
            e = e || window.event;
            if (!e.which) {
                if (e.button === undefined) {
                    return 1;
                }
                return e.button < 2 ? 1 : e.button === 4 ? 2 : 3;
            } else {
                return e.which;
            }
        }
    };
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    return {
        getTouch: function getTouch(evt) {
            if (evt.touches !== undefined) {
                return evt.touches[0];
            }
            return evt;
        },
        getOffset: function getOffset(evt) {
            if (evt.offsetX && evt.offsetY) {
                return { x: evt.offsetX, y: evt.offsetY };
            }
            if (evt.layerX && evt.layerY) {
                return { x: evt.layerX, y: evt.layerY };
            }
            return this.getOffsetForElement(evt.target, evt);
        },
        getOffsetForElement: function getOffsetForElement(el, evt) {
            var bb = el.getBoundingClientRect();
            return { x: evt.clientX - bb.left, y: evt.clientY - bb.top };
        }
    };
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    'ngInject';

    function ganttSmartEvent($scope, $element, event, fn) {
        $scope.$on('$destroy', function () {
            $element.unbind(event, fn);
        });
        return {
            bindOnce: function bindOnce() {
                $element.one(event, fn);
            },
            bind: function bind() {
                $element.bind(event, fn);
            },
            unbind: function unbind() {
                $element.unbind(event, fn);
            }
        };
    }
    return ganttSmartEvent;
};

/***/ }),
/* 116 */
/***/ (function(module, exports) {

var path = 'template/gantt.tmpl.html';
var html = "<div class=\"gantt unselectable\" ng-cloak gantt-scroll-manager gantt-container-height-listener=ganttContainerHeight gantt-container-width-listener=ganttContainerWidth gantt-element-height-listener=ganttElementHeight gantt-element-width-listener=ganttElementWidth> <gantt-side> <gantt-side-background> </gantt-side-background> <gantt-side-content> </gantt-side-content> <div gantt-resizer=gantt.side.$element gantt-resizer-event-topic=side gantt-resizer-enabled=\"{{$parent.gantt.options.value('allowSideResizing')}}\" resizer-width=sideWidth class=gantt-resizer> <div ng-show=\"$parent.gantt.options.value('allowSideResizing')\" class=gantt-resizer-display></div> </div> </gantt-side> <gantt-scrollable-header> <gantt-header gantt-element-height-listener=$parent.ganttHeaderHeight> <gantt-header-columns> <div ng-repeat=\"header in gantt.columnsManager.visibleHeaders track by $index\"> <div class=gantt-header-row ng-class=\"{'gantt-header-row-last': $last, 'gantt-header-row-first': $first}\"> <gantt-column-header ng-repeat=\"column in header\"></gantt-column-header> </div> </div> </gantt-header-columns> </gantt-header> </gantt-scrollable-header> <gantt-scrollable> <gantt-body> <gantt-body-background> <gantt-row-background ng-repeat=\"row in gantt.rowsManager.visibleRows track by row.model.id\"></gantt-row-background> </gantt-body-background> <gantt-body-foreground> <div class=gantt-current-date-line ng-show=\"currentDate === 'line' && gantt.currentDateManager.position >= 0 && gantt.currentDateManager.position <= gantt.width\" ng-style=\"{'left': gantt.currentDateManager.position + 'px' }\"></div> </gantt-body-foreground> <gantt-body-columns> <gantt-column ng-repeat=\"column in gantt.columnsManager.visibleColumns\"> <gantt-time-frame ng-repeat=\"timeFrame in column.visibleTimeFrames\"></gantt-time-frame> </gantt-column> </gantt-body-columns> <div ng-if=\"gantt.columnsManager.visibleColumns == 0\" style=background-color:grey></div> <gantt-body-rows> <gantt-timespan ng-repeat=\"timespan in gantt.timespansManager.timespans track by timespan.model.id\"></gantt-timespan> <gantt-row ng-repeat=\"row in gantt.rowsManager.visibleRows track by row.model.id\"> <gantt-task ng-repeat=\"task in row.visibleTasks track by task.model.id\"> </gantt-task> </gantt-row> </gantt-body-rows> </gantt-body> </gantt-scrollable> <ng-transclude></ng-transclude> <script type=text/ng-template id=template/ganttBody.tmpl.html> <div ng-transclude class=\"gantt-body\" ng-style=\"{'width': gantt.width > 0 ? gantt.width +'px' : undefined}\"></div> </script> <script type=text/ng-template id=template/ganttHeader.tmpl.html> <div ng-transclude class=\"gantt-header\"\n             ng-show=\"gantt.columnsManager.columns.length > 0 && gantt.columnsManager.headers.length > 0\"></div> </script> <script type=text/ng-template id=template/ganttSide.tmpl.html> <div ng-transclude class=\"gantt-side\" style=\"width: auto;\"></div> </script> <script type=text/ng-template id=template/ganttSideContent.tmpl.html> <div class=\"gantt-side-content\" ng-style=\"getSideCss()\">\n        </div> </script> <script type=text/ng-template id=template/ganttHeaderColumns.tmpl.html> <div ng-transclude class=\"gantt-header-columns\"\n              gantt-horizontal-scroll-receiver></div> </script> <script type=text/ng-template id=template/ganttColumnHeader.tmpl.html> <div class=\"gantt-column-header\" ng-class=\"{'gantt-column-header-last': $last, 'gantt-column-header-first': $first}\">{{::column.label}}</div> </script> <script type=text/ng-template id=template/ganttBodyBackground.tmpl.html> <div ng-transclude class=\"gantt-body-background\"></div> </script> <script type=text/ng-template id=template/ganttBodyForeground.tmpl.html> <div ng-transclude class=\"gantt-body-foreground\"></div> </script> <script type=text/ng-template id=template/ganttBodyColumns.tmpl.html> <div ng-transclude class=\"gantt-body-columns\"></div> </script> <script type=text/ng-template id=template/ganttColumn.tmpl.html> <div ng-transclude class=\"gantt-column gantt-foreground-col\" ng-class=\"{'gantt-column-last': $last, 'gantt-column-first': $first}\"></div> </script> <script type=text/ng-template id=template/ganttTimeFrame.tmpl.html> <div class=\"gantt-timeframe\"></div> </script> <script type=text/ng-template id=template/ganttScrollable.tmpl.html> <div ng-transclude class=\"gantt-scrollable\" gantt-scroll-sender ng-style=\"getScrollableCss()\"></div> </script> <script type=text/ng-template id=template/ganttScrollableHeader.tmpl.html> <div ng-transclude class=\"gantt-scrollable-header\" ng-style=\"getScrollableHeaderCss()\"></div> </script> <script type=text/ng-template id=template/ganttBodyRows.tmpl.html> <div ng-transclude class=\"gantt-body-rows\"></div> </script> <script type=text/ng-template id=template/ganttTimespan.tmpl.html> <div class=\"gantt-timespan\" ng-class=\"timespan.model.classes\">\n        </div> </script> <script type=text/ng-template id=template/ganttTask.tmpl.html> <div class=\"gantt-task\" ng-class=\"task.model.classes\">\n            <gantt-task-background></gantt-task-background>\n            <gantt-task-foreground></gantt-task-foreground>\n            <gantt-task-content></gantt-task-content>\n        </div> </script> <script type=text/ng-template id=template/ganttTaskBackground.tmpl.html> <div class=\"gantt-task-background\" ng-style=\"{'background-color': task.model.color}\"></div> </script> <script type=text/ng-template id=template/ganttTaskForeground.tmpl.html> <div class=\"gantt-task-foreground\">\n            <div ng-if=\"task.truncatedRight\" class=\"gantt-task-truncated-right\" ng-style=\"{'padding-right': task.truncatedRightOffset + 'px'}\">&gt;</div>\n            <div ng-if=\"task.truncatedLeft\" class=\"gantt-task-truncated-left\" ng-style=\"{'padding-left': task.truncatedLeftOffset + 'px'}\">&lt;</div>\n        </div> </script> <script type=text/ng-template id=template/ganttTaskContent.tmpl.html> <div class=\"gantt-task-content\" unselectable=\"on\"><span unselectable=\"on\" gantt-bind-compile-html=\"getTaskContent()\"/></div> </script> <script type=text/ng-template id=template/ganttRowBackground.tmpl.html> <div class=\"gantt-row gantt-row-height\"\n             ng-class=\"row.model.classes\"\n             ng-class-odd=\"'gantt-row-odd'\"\n             ng-class-even=\"'gantt-row-even'\"\n             ng-style=\"{'height': row.model.height}\">\n            <div class=\"gantt-row-background\"\n                 ng-style=\"{'background-color': row.model.color}\">\n            </div>\n        </div> </script> <script type=text/ng-template id=template/ganttRow.tmpl.html> <div class=\"gantt-row gantt-row-height\"\n             ng-class=\"row.model.classes\"\n             ng-class-odd=\"'gantt-row-odd'\"\n             ng-class-even=\"'gantt-row-even'\"\n             ng-style=\"{'height': row.model.height}\">\n            <div ng-transclude class=\"gantt-row-content\"></div>\n        </div> </script> <script type=text/ng-template id=template/ganttSideBackground.tmpl.html> <div class=\"gantt-side-background\">\n            <div class=\"gantt-side-background-header\" ng-style=\"{height: $parent.ganttHeaderHeight + 'px'}\">\n                <div ng-show=\"$parent.ganttHeaderHeight\" class=\"gantt-header-row gantt-side-header-row\"></div>\n            </div>\n            <div class=\"gantt-side-background-body\" ng-style=\"getMaxHeightCss()\">\n                <div gantt-vertical-scroll-receiver>\n                    <div class=\"gantt-row gantt-row-height \"\n                         ng-class-odd=\"'gantt-row-odd'\"\n                         ng-class-even=\"'gantt-row-even'\"\n                         ng-class=\"row.model.classes\"\n                         ng-repeat=\"row in gantt.rowsManager.visibleRows track by row.model.id\"\n                         ng-style=\"{'height': row.model.height}\">\n                        <div class=\"gantt-row-label gantt-row-background\"\n                             ng-style=\"{'background-color': row.model.color}\">\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div> </script> </div> ";
window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
module.exports = path;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(119), __esModule: true };

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(144);
__webpack_require__(142);
__webpack_require__(145);
__webpack_require__(146);
module.exports = __webpack_require__(17).Symbol;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(143);
__webpack_require__(147);
module.exports = __webpack_require__(29).f('iterator');

/***/ }),
/* 121 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 122 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(6)
  , toLength  = __webpack_require__(139)
  , toIndex   = __webpack_require__(138);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(121);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(14)
  , gOPS    = __webpack_require__(37)
  , pIE     = __webpack_require__(22);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4).document && document.documentElement;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(30);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(30);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(35)
  , descriptor     = __webpack_require__(15)
  , setToStringTag = __webpack_require__(23)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(8)(IteratorPrototype, __webpack_require__(10)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 130 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(14)
  , toIObject = __webpack_require__(6);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(16)('meta')
  , isObject = __webpack_require__(13)
  , has      = __webpack_require__(5)
  , setDesc  = __webpack_require__(9).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(12)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(9)
  , anObject = __webpack_require__(11)
  , getKeys  = __webpack_require__(14);

module.exports = __webpack_require__(7) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(22)
  , createDesc     = __webpack_require__(15)
  , toIObject      = __webpack_require__(6)
  , toPrimitive    = __webpack_require__(27)
  , has            = __webpack_require__(5)
  , IE8_DOM_DEFINE = __webpack_require__(33)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(7) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(6)
  , gOPN      = __webpack_require__(36).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(5)
  , toObject    = __webpack_require__(140)
  , IE_PROTO    = __webpack_require__(24)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26)
  , defined   = __webpack_require__(18);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(26)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(18);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(122)
  , step             = __webpack_require__(130)
  , Iterators        = __webpack_require__(20)
  , toIObject        = __webpack_require__(6);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(34)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 142 */
/***/ (function(module, exports) {



/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(137)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(34)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(4)
  , has            = __webpack_require__(5)
  , DESCRIPTORS    = __webpack_require__(7)
  , $export        = __webpack_require__(32)
  , redefine       = __webpack_require__(39)
  , META           = __webpack_require__(132).KEY
  , $fails         = __webpack_require__(12)
  , shared         = __webpack_require__(25)
  , setToStringTag = __webpack_require__(23)
  , uid            = __webpack_require__(16)
  , wks            = __webpack_require__(10)
  , wksExt         = __webpack_require__(29)
  , wksDefine      = __webpack_require__(28)
  , keyOf          = __webpack_require__(131)
  , enumKeys       = __webpack_require__(125)
  , isArray        = __webpack_require__(128)
  , anObject       = __webpack_require__(11)
  , toIObject      = __webpack_require__(6)
  , toPrimitive    = __webpack_require__(27)
  , createDesc     = __webpack_require__(15)
  , _create        = __webpack_require__(35)
  , gOPNExt        = __webpack_require__(135)
  , $GOPD          = __webpack_require__(134)
  , $DP            = __webpack_require__(9)
  , $keys          = __webpack_require__(14)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(36).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(22).f  = $propertyIsEnumerable;
  __webpack_require__(37).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(21)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(8)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('asyncIterator');

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28)('observable');

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(141);
var global        = __webpack_require__(4)
  , hide          = __webpack_require__(8)
  , Iterators     = __webpack_require__(20)
  , TO_STRING_TAG = __webpack_require__(10)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=angular-gantt-core.js.map