var path = require('path');
var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var banner = require('./banner');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');


var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env;

webpackConfig = merge(baseWebpackConfig, {
  entry: {
    'angular-gantt': ['./src/index.ts', './src/plugins/index.ts'],
    'angular-gantt-core': './src/index.ts',
    'angular-gantt-plugins': './src/plugins/index.ts'
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('[name].js'),
    chunkFilename: utils.assetsPath('[id].js')
  },
  externals: {
    'angular': 'angular',
    'moment': 'moment',
    'moment-range': 'moment-range',
    'angular-gantt': 'angular-gantt',
    'angular-animate': 'angular-animate',
    'angular-strap': 'angular-strap',
    'angular-ui-tree': 'ui.tree',
    'angular-native-dragdrop': 'angular-native-dragdrop',
    'bootstrap': 'bootstrap',
    'css-element-queries/src/ElementQueries': 'ElementQueries',
    'css-element-queries/src/ResizeSensor': 'ResizeSensor',
    'font-awesome': 'font-awesome',
    'jsplumb': 'jsPlumb'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    new webpack.BannerPlugin({banner:banner, entryOnly: true}),
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('[name].css')
    })
  ]
});

webpackMinifiedConfig = merge(webpackConfig, {
  output: {
    filename: utils.assetsPath('[name].min.js'),
    chunkFilename: utils.assetsPath('[id].min.js')
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('[name].min.css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackMinifiedConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackMinifiedConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = [webpackConfig, webpackMinifiedConfig];
