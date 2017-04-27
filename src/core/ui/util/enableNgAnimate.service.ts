import angular from 'angular';

export default function ($injector) {
  'ngInject';

  let ngAnimate: any;
  try {
    ngAnimate = $injector.get('$animate');
  } catch (e) {
    // Do nothing
  }

  if (ngAnimate !== undefined) {
    return function (element, enabled) {
      if (angular.version.major >= 1 && angular.version.minor >= 4) {
        // AngularJS 1.4 breaking change, arguments are flipped.
        ngAnimate.enabled(element, enabled);
      } else {
        ngAnimate.enabled(enabled, element);
      }
    };
  } else {
    return angular.noop;
  }
}
