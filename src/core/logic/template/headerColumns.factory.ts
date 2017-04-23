import {IAugmentedJQuery} from 'angular';

export class GanttHeaderColumns {
  $element: IAugmentedJQuery;

  constructor($element: IAugmentedJQuery) {
    this.$element = $element;
  };
}

export default function () {
  'ngInject';

  return GanttHeaderColumns;
}
