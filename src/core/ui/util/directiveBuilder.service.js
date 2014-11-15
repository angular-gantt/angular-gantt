(function(){
    'use strict';
    angular.module('gantt').service('GanttDirectiveBuilder', [function() {
        var DirectiveBuilder = function DirectiveBuilder(directiveName, templateUrl, require, restrict) {
            var self = this;

            this.directiveName = directiveName;
            this.templateUrl = templateUrl === undefined ? 'template/' + directiveName + '.tmpl.html' : templateUrl;
            this.require = require === undefined ? '^gantt' : require;
            this.restrict = restrict === undefined ? 'E' : restrict;
            this.transclude = true;
            this.replace = true;

            this.build = function() {
                var directiveName = self.directiveName;
                var templateUrl = self.templateUrl;
                var controllerFunction = self.controller;

                return {
                    restrict: self.restrict,
                    require: self.require,
                    transclude: self.transclude,
                    replace: self.replace,
                    templateUrl: function(tElement, tAttrs) {
                        if (tAttrs.templateUrl === undefined) {
                            return templateUrl;
                        } else {
                            return tAttrs.templateUrl;
                        }
                    },
                    compile: function () {
                        return {
                            pre: function preLink(scope, iElement, iAttrs, controller) {
                                scope.gantt.api.directives.raise.preLink(directiveName, scope, iElement, iAttrs, controller);
                            },
                            post: function postLink(scope, iElement, iAttrs, controller) {
                                scope.gantt.api.directives.raise.postLink(directiveName, scope, iElement, iAttrs, controller);
                            }
                        };
                    },
                    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                        var controller = this;

                        if (controllerFunction !== undefined) {
                            controllerFunction($scope, $element, $attrs, controller);
                        }

                        $scope.gantt.api.directives.raise.new(directiveName, $scope, $element, $attrs, controller);
                        $scope.$on('$destroy', function() {
                            $scope.gantt.api.directives.raise.destroy(directiveName, $scope, $element, $attrs, controller);
                        });
                    }]
                };
            };
        };

        return DirectiveBuilder;
    }]);
}());
