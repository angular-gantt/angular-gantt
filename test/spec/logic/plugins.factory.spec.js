'use strict';
describe('Unit: Gantt', function() {
    // Load the module with MainController
    beforeEach(function(){
        module('gantt');
        module('gantt.labels');
        module('gantt.sortable');
        module('gantt.movable');
        module('gantt.drawtask');
        module('gantt.tooltips');
        module('gantt.bounds');
        module('gantt.progress');
        module('gantt.table');
        module('gantt.tree');
        module('gantt.groups');
    });

    var Gantt;
    var moment;
    var $controller;
    var $rootScope;
    var $compile;
    var $timeout;

    beforeEach(inject(['$controller', '$rootScope', '$compile', '$timeout', 'Gantt', 'moment', function(_$controller_, _$rootScope_, _$compile_, _$timeout_, _Gantt_, _moment_) {
        Gantt = _Gantt_;
        moment = _moment_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
    }]));

    it('Can load every plugins',
        function() {
            var $scope = $rootScope.$new();

            $compile('<div gantt api="api">' +
            '<gantt-labels></gantt-labels>' +
            '<gantt-tree></gantt-tree>' +
            '<gantt-table></gantt-table>' +
            '<gantt-groups></gantt-groups>' +
            '<gantt-tooltips></gantt-tooltips>' +
            '<gantt-bounds></gantt-bounds>' +
            '<gantt-progress></gantt-progress>' +
            '<gantt-sortable></gantt-sortable>' +
            '<gantt-movable></gantt-movable>' +
            '<gantt-draw-task></gantt-draw-task>' +
            '</div>')($scope);

            $scope.$digest();
            $timeout.flush();
        }
    );

});
