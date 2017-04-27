// This is the webpack config used for unit tests.

var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf')

var webpackConfig = merge(baseConfig, {
  // no need for app entry during tests
  // use inline sourcemap for karma-sourcemap-loader
  module: {
    rules: utils.styleLoaders()
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/test.env')
    }),
    // devtool option doesn't output typescript sourcemaps to karma
    new webpack.SourceMapDevToolPlugin({
      filename: null, // if no value is provided the sourcemap is inlined
      test: /\.(ts|js|html)($|\?)/i // process .js and .ts files only
    })
  ]
})

module.exports = webpackConfig
