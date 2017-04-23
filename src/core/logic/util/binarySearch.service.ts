export default class GanttBinarySearch {
  // Returns the object on the left and right in an array using the given cmp function.
  // The compare function defined which property of the value to compare (e.g.: c => c.left)

  getIndicesOnly<T, C = number|Date>(input: T[], value: C, comparer: {(T): C}, strict?: boolean) {
    let lo = -1;
    let hi = input.length;
    while (hi - lo > 1) {
      let mid = Math.floor((lo + hi) / 2);
      if (strict ? comparer(input[mid]) < value : comparer(input[mid]) <= value) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (!strict && input[lo] !== undefined && comparer(input[lo]) === value) {
      hi = lo;
    }
    return [lo, hi];
  }

  get<T, C = number|Date>(input: T[], value: C, comparer: {(T): C}, strict?: boolean) {
    let res = this.getIndicesOnly(input, value, comparer, strict);
    return [input[res[0]], input[res[1]]];
  }
}
