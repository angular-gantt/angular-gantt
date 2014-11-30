(function() {
    'use strict';
    angular.module('gantt').factory('GanttOptions', [function() {
        var GanttOptions = function(values, defaultValues) {
            this.defaultValues = defaultValues;
            this.values = values;

            this.defaultValue = function(optionName) {
                var defaultValue = this.defaultValues[optionName];
                if (angular.isFunction(defaultValue)) {
                    defaultValue = defaultValue();
                }

                return defaultValue;
            };

            this.sanitize = function(optionName, optionValue) {
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

            this.value = function(optionName) {
                return this.sanitize(optionName, this.values[optionName]);
            };

            this.set = function(optionName, optionValue) {
                this.values[optionName] = optionValue;
            };

            this.initialize = function() {
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
    }]);
}());
