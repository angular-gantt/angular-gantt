export class GanttOptions {
  private defaultValues: { [option: string]: any; };
  private values: { [option: string]: any; };

  constructor(values: { [option: string]: any; }, defaultValues: { [option: string]: any; }) {
    this.defaultValues = defaultValues;
    this.values = values;
  }

  defaultValue(optionName: string) {
    let defaultValue = this.defaultValues[optionName];
    if (typeof(defaultValue) === 'function') {
      defaultValue = defaultValue();
    }

    return defaultValue;
  };

  sanitize(optionName: string, optionValue: any) {
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

  value(optionName: string) {
    return this.sanitize(optionName, this.values[optionName]);
  };

  set(optionName: string, optionValue: any) {
    this.values[optionName] = optionValue;
  };

  initialize() {
    for (let optionName in this.values) {
      if (this.values.hasOwnProperty(optionName)) {
        this.values[optionName] = this.value(optionName);
      }
    }
    return this.values;
  };
}

export default function () {
  'ngInject';

  return GanttOptions;
}
