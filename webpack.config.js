'use strict'

const cssnext = require('postcss-cssnext')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const mergeAndConcat = require('merge-and-concat')
const OptimizeJsPlugin = require('optimize-js-plugin')
const postcssImport = require('postcss-import')
const querystring = require('querystring')
const webpack = require('webpack')

const config = require('./config')

const webpackConfig = {
  entry: {
    options: ['babel-polyfill', `./${config.sourceDir}/js/options/index.jsx`],
    popup: ['babel-polyfill', `./${config.sourceDir}/js/popup/index.jsx`]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /\/node_modules\//,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: `./${config.outputDir}/js/[name].js`
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin(`./${config.outputDir}/js/common.js`),
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
  postcss: () => [
    postcssImport({
      addDependencyTo: webpack
    }),
    cssnext({
      // autoprefixer: {
      //   browsers: 'Chrome >= 31'
      // }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    timings: true,
    version: false
  }
}

const cssLoaderConfigQS = querystring.stringify({
  modules: true,
  importLoaders: 1,
  localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
})
switch (process.env.NODE_ENV) {
  case 'development':
    mergeAndConcat(webpackConfig, {
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /\.css$/,
            loaders: [
              'style-loader?' + querystring.stringify({
                sourceMap: true
              }),
              `css-loader?${cssLoaderConfigQS}`,
              'postcss-loader'
            ]
          }
        ]
      },
      watch: true
    })
    break

  case 'production':
    mergeAndConcat(webpackConfig, {
      module: {
        loaders: [
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract([
              `css-loader?${cssLoaderConfigQS}`,
              'postcss-loader'
            ])
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin(`./${config.outputDir}/css/[name].css`, {
          allChunks: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            drop_console: true,
            pure_getters: true,
            unsafe: true,
            warnings: false
          },
          output: {
            comments: false,
            screw_ie8: true
          }
        }),
        new OptimizeJsPlugin()
      ]
    })
    break

  default:
}

module.exports = webpackConfig
