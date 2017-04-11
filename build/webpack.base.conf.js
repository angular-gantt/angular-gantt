var path = require('path')
var utils = require('./utils')
var config = require('../config')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    'angular-gantt': ['./src/index.ts', './src/plugins/index.ts'],
    'angular-gantt-core': './src/index.ts',
    'angular-gantt-demo': './demo/index.ts',
    'angular-gantt-plugins': './src/plugins/index.ts'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    modules: [
      resolve('src'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test'), resolve('demo')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        include: [resolve('src'), resolve('test'), resolve('demo')],
        options: {
          formatter: 'grouped',
          formattersDirectory: 'node_modules/custom-tslint-formatters/formatters'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('demo')]
      },
      {
        test: /\.ts$/,
        use: [
          /*
          {
            loader: 'angular-hot-loader'
          },
          */
          {
            loader: 'ng-annotate-loader'
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              useCache: true
            }
          }],
        include: [resolve('src'), resolve('test'), resolve('demo')]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'ngtemplate-loader',
            options: {
              relativeTo: path.resolve(__dirname, '..', 'src') + '/'
            }
          },
          {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }],
        exclude: [resolve('demo/index.html')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
