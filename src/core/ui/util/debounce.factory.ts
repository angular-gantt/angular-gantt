import {ITimeoutService} from 'angular';

export interface GanttDebounce {
  (fn: any, timeout?: number, invokeApply?: boolean): Function;
}

export default function ($timeout: ITimeoutService): GanttDebounce {
  'ngInject';

  function debounce(fn: any, timeout: number, invokeApply = false): Function {
    let nthCall = 0;
    return function () {
      let self = this;
      let argz = arguments;
      nthCall++;
      let later = (function (version) {
        return function () {
          if (version === nthCall) {
            return fn.apply(self, argz);
          }
        };
      })(nthCall);
      return $timeout(later, timeout, invokeApply === undefined ? true : invokeApply);
    };
  }

  return debounce;
}
