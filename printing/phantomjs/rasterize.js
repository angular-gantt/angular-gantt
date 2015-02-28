/*
Angular-Gantt (www.angular-gantt.com)
=====================================
Sample rasterize script file to print the gantt with PhantomJS 1.9.8

Usage:
1. Install PhantomJS (www.phantomjs.org)
2. Put the gantt on a empty HTML page with no other elements.
   Make sure the gantt column-width property is set to disable the auto width behaviour.
   Take a look at the example call Plnkr (http://run.plnkr.co/plunks/lrC5RFfeItMA5JCVMVWF/) as reference.
3. Run with: 
   "phantomjs rasterize.js URL format(pdf|jpg|png) output [paperwidth*paperheight|paperformat[,orientation]] [fit(true|false)]"

   All paper and fit options are only valid for PDF outputs. Paper width & height can be specified as in, mm, cm or px.


Example calls:
phantomjs rasterize.js http://run.plnkr.co/plunks/lrC5RFfeItMA5JCVMVWF/ pdf 'demo.pdf' a4,landscape true
phantomjs rasterize.js http://run.plnkr.co/plunks/lrC5RFfeItMA5JCVMVWF/ pdf 'demo.pdf' 8.5in*11in
phantomjs rasterize.js http://run.plnkr.co/plunks/lrC5RFfeItMA5JCVMVWF/ pdf 'demo.pdf' 297mm*210mm
phantomjs rasterize.js http://run.plnkr.co/plunks/lrC5RFfeItMA5JCVMVWF/ png 'demo.png'
phantomjs rasterize.js http://run.plnkr.co/plunks/lrC5RFfeItMA5JCVMVWF/ jpg 'dev/stdout'

Important:
Currently there is a PDF bug in PhantomJS 2.0 and this script may not work with this version.
Issue: https://github.com/ariya/phantomjs/issues/12685

CSS frameworks like Bootstrap may disable background colors when printing as pdf. Either modify them or use your own CSS styles.
*/

var HELP = 'Usage:\nphantomjs rasterize.js URL format(pdf|jpg|png) output [paperwidth*paperheight|paperformat[,orientation]] [fit(true|false)]';

var EXIT_CODE_INVALID_ARGUMENTS = 1;
var EXIT_CODE_UNCATCHED_ERROR = 2;
var EXIT_CODE_INVALID_URL = 3;

var GANTT_MIN_ZOOM = 0.1;
var JS_INIT_WAIT_TIME = 50;
var RENDER_WAIT_TIME = 200;

var page = require('webpage').create();
var system = require('system');

console.error = function () {
    system.stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

page.onResourceError = function(resourceError) {
    console.error('Unable to load resource #' + resourceError.id + ' with url:' + resourceError.url + '. Error: ' + resourceError.errorString + ' (' + resourceError.errorCode + ')');
};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.error(msg + '. Line: ' + lineNum + '. Source #' + sourceId);
};

page.onError = function (msg, trace) {
    console.error(msg);
    trace.forEach(function(item) {
        console.error('  ', item.file, ':', item.line);
    });

    phantom.exit(EXIT_CODE_UNCATCHED_ERROR);
};

var parseSizeValue = function(input) {
    var units = [{ unit: 'mm', factor: 72 / 25.4 },
                 { unit: 'cm', factor: 72 / 2.54 },
                 { unit: 'in', factor:  72 },
                 { unit: 'px', factor: 1 },
                 { unit: '', factor: 1 }]

    for(var i = 0; i < units.length; i++) {
        var unit = units[i].unit;
        if (input.length >= unit.length &&
            input.substr(input.length - unit.length).toLowerCase() === unit) {
            var size = input.substr(0, input.length - unit.length);
            return parseInt(size, 10) * units[i].factor;
        }
    }

    return 0;
};

var getPaperDimensions = function(format, orientation) {
    // See https://github.com/ariya/phantomjs/blob/12870d90ad995d6704288690125c07bb0d8bedd9/src/webpage.cpp
    var formats = {};
    formats['A0'] = '841mm*1189mm';
    formats['A1'] = '594mm*841mm';
    formats['A2'] = '420mm*594mm';
    formats['A3'] = '297mm*420mm';
    formats['A4'] = '210mm*297mm';
    formats['A5'] = '148mm*210mm';
    formats['A6'] = '105mm*148mm';
    formats['A7'] = '74mm*105mm';
    formats['A8'] = '52mm*74mm';
    formats['A9'] = '37mm*52mm';
    formats['A10'] = '26mm*27mm';
    formats['B0'] = '1000mm*1414mm';
    formats['B1'] = '707mm*1000mm';
    formats['B2'] = '500mm*707mm';
    formats['B3'] = '353mm*500mm';
    formats['B4'] = '250mm*353mm';
    formats['B5'] = '176mm*250mm';
    formats['B6'] = '125mm*176mm';
    formats['B7'] = '88mm*125mm';
    formats['B8'] = '62mm*88mm';
    formats['B9'] = '44mm*62mm';
    formats['B10'] = '31mm*44mm';
    formats['C5E'] = '163mm*229mm';
    formats['COMM10E'] = '105mm*241mm';
    formats['DLE'] = '110mm*220mm';
    formats['EXECUTIVE'] = '7.5in*10in';
    formats['LEDGER'] = '17in*11in';
    formats['LEGAL'] = '8.5in*14in';
    formats['LETTER'] = '8.5in*11in';
    formats['TABLOID'] = '11in*17in';

    var dimensions = formats[format.toUpperCase()];
    if (dimensions !== undefined) {
        if (orientation.toLowerCase() === "landscape") {
            dimensions = dimensions.split("*");
            return dimensions[1] + '*' + dimensions[0];
        } else {
            return dimensions;
        }
    } else {
        throw 'Format ' + format + ' not supported';
    }
};

var getPaperMargin = function(condition) {
    var margin = 0;

    if (typeof page.paperSize.margin !== 'object') {
        margin = parseSizeValue(page.paperSize.margin) * 2;
    } else {
        if (condition.indexOf('l') !== -1 && page.paperSize.margin.left !== undefined) { margin += parseSizeValue(page.paperSize.margin.left); }
        if (condition.indexOf('r') !== -1 && page.paperSize.margin.right !== undefined) { margin += parseSizeValue(page.paperSize.margin.right); }
        if (condition.indexOf('t') !== -1 && page.paperSize.margin.top !== undefined) { margin += parseSizeValue(page.paperSize.margin.top); }
        if (condition.indexOf('b') !== -1 && page.paperSize.margin.bottom !== undefined) { margin += parseSizeValue(page.paperSize.margin.bottom); }
    }

    return margin;
};

var calcZoomFactor = function() {
    var sourceWidth = page.viewportSize.width;
    var targetWidth = parseSizeValue(page.paperSize.width) - getPaperMargin('lr');

    var sourceHeight = page.viewportSize.height;
    var targetHeight = parseSizeValue(page.paperSize.height) - getPaperMargin('tb');

    var correctionFactor = 1.247; // Workaround: PDF dpi issues with PhantomJS
    var zoomFactor = Math.min(targetWidth/sourceWidth, targetHeight/sourceHeight);
    return zoomFactor * correctionFactor;
};

var setPaperSize = function(paperSize, fitToPaper) {
    var paperFormatArguments = paperSize.split('*');
    if (paperFormatArguments.length === 2) { // paperwidth*paperheight
        page.paperSize = { width: paperFormatArguments[0], height: paperFormatArguments[1], margin: '1cm' };

        if (fitToPaper) {
            var factor = calcZoomFactor();
            if (factor < 1) {
                page.zoomFactor = Math.max(GANTT_MIN_ZOOM, factor);
            }
        }
    } else { // paperformat,orientation
        paperFormatArguments = paperFormatArguments[0].split(',');
        var paperFormat = paperFormatArguments[0];
        var paperOrientation = paperFormatArguments.length > 1 ? paperFormatArguments[1] : 'landscape';
        paperSize = getPaperDimensions(paperFormat, paperOrientation);

        setPaperSize(paperSize, fitToPaper);
    }
};

var setViewportSize = function() {
    var ganttDimensions = page.evaluate(function () {
        var ganttElement = document.getElementsByClassName('gantt')[0];
        var ganttSideElement = document.getElementsByClassName('gantt-side')[0];
        var ganttInnerElement = document.getElementsByClassName('gantt-body')[0];

        var width = ganttSideElement.clientWidth + ganttInnerElement.clientWidth;
        var height = ganttElement.clientHeight;
        var clippingHeight = ganttSideElement.clientHeight;

        return [width, height, clippingHeight];
    });

    page.viewportSize = { width: ganttDimensions[0]+20, height: ganttDimensions[1] };
    page.clipRect = { width: ganttDimensions[0], height: ganttDimensions[2] };

    // Workaround: Make sure all columns are recalculated after viewport size changed
    page.evaluate(function() {
        var ganttScope = angular.element(document.getElementsByClassName('gantt')[0]).scope();
        ganttScope.$apply(function() {
            ganttScope.gantt.api.columns.refresh();
        });
    });
};


if (system.args.length < 4 || system.args.length > 6) {
    console.error(HELP);
    phantom.exit(EXIT_CODE_INVALID_ARGUMENTS);
}

var url = system.args[1];
var outputFormat = system.args[2].toLowerCase();
var outputPath = system.args[3];
var paperSize = system.args.length > 4 ? system.args[4]: 'A4,landscape';
var fitToPaper = system.args.length > 5 && system.args[5] === 'true';

page.open(url, function (status) {
    if (status !== 'success') {
        console.error('Unable to load the url: ' + url);
        phantom.exit(EXIT_CODE_INVALID_URL);
    } else {
        window.setTimeout(function () {
            setViewportSize();

            if (outputFormat === "pdf") {
                setPaperSize(paperSize, fitToPaper);
            }

            window.setTimeout(function () {
                page.render(outputPath, { format: outputFormat });
                phantom.exit();
            }, RENDER_WAIT_TIME);
        }, JS_INIT_WAIT_TIME);
    }
});
