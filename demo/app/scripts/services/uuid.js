'use strict';

/**
 * @ngdoc service
 * @name angularGanttDemoApp.Uuid
 * @description
 * # Uuid
 * Service in the angularGanttDemoApp.
 */
angular.module('angularGanttDemoApp')
    .service('Uuid', function Uuid() {
        return {
            s4: function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            },
            randomUuid: function() {
                return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                    this.s4() + '-' + this.s4() + this.s4() + this.s4();
            }
        };
    });
