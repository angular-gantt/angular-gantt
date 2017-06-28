export default function () {
  'ngInject'
  return {
    initialize: function (options) {
      options.enabled = options.enabled !== undefined ? options.enabled : true
      options.allowMoving = options.allowMoving !== undefined ? !!options.allowMoving : true
      options.allowResizing = options.allowResizing !== undefined ? !!options.allowResizing : true
      if (typeof(options.allowRowSwitching) !== 'function') {
        options.allowRowSwitching = options.allowRowSwitching !== undefined ? !!options.allowRowSwitching : true
      }
      return options
    }
  }
}
