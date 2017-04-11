import angular from 'angular';

export default function () {
  'ngInject';
  let GanttOptions = function (values, defaultValues) {
    this.defaultValues = defaultValues;
    this.values = values;

    this.defaultValue = function (optionName) {
      let defaultValue = this.defaultValues[optionName];
      if (angular.isFunction(defaultValue)) {
        defaultValue = defaultValue();
      }

      return defaultValue;
    };

    this.sanitize = function (optionName, optionValue) {
      if (!optionValue) {
        let defaultValue = this.defaultValue(optionName);
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
      for (let optionName in this.values) {
        let optionValue = this.values[optionName];
        if (this.values.hasOwnProperty(optionName)) {
          this.values[optionName] = this.value(optionName, optionValue);
        }
      }
      return this.values;
    };
  };

  return GanttOptions;
}
