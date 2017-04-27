import {IDocumentService} from 'angular';

export default class GanttDom {
  $document: IDocumentService;

  constructor($document: IDocumentService) {
    this.$document = $document;
  };

  elementFromPoint(x: number, y: number): HTMLElement {
    return this.$document[0].elementFromPoint(x, y) as HTMLElement;
  }

  elementsFromPoint(x: number, y: number, depth?: number): HTMLElement[] {
    let elements: HTMLElement[] = [];
    let previousPointerEvents: {value: string, priority: string}[] = [];
    let cDepth = 0;
    let current: HTMLElement;
    let i: number;
    let l: number;
    let d: {value: string, priority: string};

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
  }

  findElementFromPoint(x: number, y: number, checkFunction: {(current: HTMLElement): HTMLElement}): HTMLElement {
    let elements: HTMLElement[] = [];
    let previousPointerEvents: {value: string, priority: string}[] = [];
    let cDepth = 0;
    let current: HTMLElement;
    let found: HTMLElement;
    let i: number;
    let l: number;
    let d: {value: string, priority: string};

    // get all elements via elementFromPoint, and remove them from hit-testing in order
    while ((current = this.elementFromPoint(x, y) as HTMLElement) && elements.indexOf(current) === -1 && current !== null) {

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
  }

  isElementVisible(element: HTMLElement) {
    return element.offsetParent !== undefined && element.offsetParent !== null;
  }
}
