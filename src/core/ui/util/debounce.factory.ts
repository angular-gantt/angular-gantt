export default function ($timeout) {
  'ngInject';
  function debounce(fn, timeout, invokeApply) {
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
