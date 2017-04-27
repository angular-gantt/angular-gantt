import {IAugmentedJQuery, IScope} from 'angular';

/**
 * Auto released the binding when the scope is destroyed.
 *
 * Use if an event is registered on another element than the scope.
 */
export class GanttSmartEvent {
  $element: IAugmentedJQuery;
  event: string;
  fn: any;

  constructor($scope: IScope, $element: IAugmentedJQuery, event: string, fn: any) {
    this.$element = $element;
    this.event = event;
    this.fn = fn;

    $scope.$on('$destroy', () => {
      this.$element.unbind(this.event, this.fn);
    });
  }

  bindOnce() {
    this.$element.one(this.event, this.fn);
  }

  bind() {
    this.$element.bind(this.event, this.fn);
  }

  unbind() {
    this.$element.unbind(this.event, this.fn);
  }
}

export default function () {
  'ngInject';

  return GanttSmartEvent;
}
