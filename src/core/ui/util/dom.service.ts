export default function ($document) {
  'ngInject';
  return {
    elementFromPoint: function (x, y) {
      return $document[0].elementFromPoint(x, y);
    },
    elementsFromPoint: function (x, y, depth) {
      let elements = [];
      let previousPointerEvents = [];
      let cDepth = 0;
      let current;
      let i;
      let l;
      let d;

      // get all elements via elementFromPoint, and remove them from hit-testing in order
      // tslint:disable:no-conditional-assignment
      while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null &&
      (depth === undefined || cDepth < depth)) {

        // push the element and its current style
        elements.push(current);
        previousPointerEvents.push({
          value: current.style.getPropertyValue('visibility'),
          priority: current.style.getPropertyPriority('visibility')
        });

        // add "pointer-events: none", to get to the underlying element
        current.style.setProperty('visibility', 'hidden', 'important');

        cDepth++;
      }

      // restore the previous pointer-events values
      for (i = 0, l = previousPointerEvents.length; i < l; i++) {
        d = previousPointerEvents[i];
        elements[i].style.setProperty('visibility', d.value ? d.value : '', d.priority);
      }

      return elements;
    },
    findElementFromPoint: function (x, y, checkFunction) {
      let elements = [];
      let previousPointerEvents = [];
      let cDepth = 0;
      let current;
      let found;
      let i;
      let l;
      let d;

      // get all elements via elementFromPoint, and remove them from hit-testing in order
      while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null) {

        // push the element and its current style
        elements.push(current);
        previousPointerEvents.push({
          value: current.style.getPropertyValue('visibility'),
          priority: current.style.getPropertyPriority('visibility')
        });

        // add "visibility: hidden", to get to the underlying element.
        // Would be better with pointer-events: none, but IE<11 doesn't support this.
        current.style.setProperty('visibility', 'hidden', 'important');

        cDepth++;

        if (checkFunction(current)) {
          found = current;
          break;
        }
      }

      // restore the previous pointer-events values
      for (i = 0, l = previousPointerEvents.length; i < l; i++) {
        d = previousPointerEvents[i];
        elements[i].style.setProperty('visibility', d.value ? d.value : '', d.priority);
      }

      return found;
    },
    isElementVisible: function (element) {
      return element.offsetParent !== undefined && element.offsetParent !== null;
    }
  };
}
