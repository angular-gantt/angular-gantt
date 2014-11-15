(function(){
    'use strict';
    angular.module('gantt').factory('GanttObjectModel', ['ganttUtils', 'moment', function(utils, moment) {
        var ObjectModel = function(api) {
            this.api = api;

            this.api.registerEvent('tasks', 'clean');
            this.api.registerEvent('rows', 'clean');
            this.api.registerEvent('timespans', 'clean');
        };

        ObjectModel.prototype.cleanTask = function(model) {
            if (model.id === undefined) {
                model.id = utils.randomUuid();
            }

            if (model.from !== undefined && !moment.isMoment(model.from)) {
                model.from = moment(model.from);
            }

            if (model.to !== undefined && !moment.isMoment(model.to)) {
                model.to = moment(model.to);
            }

            this.api.tasks.raise.clean(model);
        };

        ObjectModel.prototype.cleanRow = function(model) {
            if (model.id === undefined) {
                model.id = utils.randomUuid();
            }

            if (model.from !== undefined && !moment.isMoment(model.from)) {
                model.from = moment(model.from);
            }

            if (model.to !== undefined && !moment.isMoment(model.to)) {
                model.to = moment(model.to);
            }

            this.api.rows.raise.clean(model);
        };

        ObjectModel.prototype.cleanTimespan = function(model) {
            if (model.id === undefined) {
                model.id = utils.randomUuid();
            }

            if (model.from !== undefined && !moment.isMoment(model.from)) {
                model.from = moment(model.from);
            }

            if (model.to !== undefined && !moment.isMoment(model.to)) {
                model.to = moment(model.to);
            }

            this.api.timespans.raise.clean(model);
        };

        return ObjectModel;
    }]);
}());

