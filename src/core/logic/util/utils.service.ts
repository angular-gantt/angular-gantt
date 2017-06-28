import angular from 'angular'

export default class GanttUtils {
  seedId = new Date().getTime()

  createBoundedWrapper (object: any, method: Function) {
    return function () {
      return method.apply(object, arguments)
    }
  }

  firstProperty (objects: Array<any>, propertyName: string, defaultValue: any) {
    // tslint:disable:one-variable-per-declaration
    for (let i = 0, l = objects.length; i < l; i++) {
      let object = objects[i]
      if (object !== undefined && propertyName in object) {
        if (object[propertyName] !== undefined) {
          return object[propertyName]
        }
      }
    }
    return defaultValue
  }

  angularIndexOf (arr: Array<any>, obj: any): number {
    for (let i = 0; i < arr.length; i++) {
      if (angular.equals(arr[i], obj)) {
        return i
      }
    }
    return -1
  }

  random4 (): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  randomUuid (): string {
    return this.random4() + this.random4() + '-' + this.random4() + '-' + this.random4() + '-' +
      this.random4() + '-' + this.random4() + this.random4() + this.random4()
  }

  newId (): number {
    return this.seedId += 1
  }
}
