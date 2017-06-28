const crequire = (require as WebpackRequire)

// Polyfill fn.bind() for PhantomJS
/* tslint:disable:no-var-requires */
Function.prototype.bind = require('function-bind')

// require all test files (files that ends with .spec.js)
const testsContext = crequire.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js and *.d.ts for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = crequire.context('../../src', true, /^\.\/(?!(?:main|.*?\.d)(\.ts)?$)/)
srcContext.keys().forEach(srcContext)
